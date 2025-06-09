import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth"; // Import User type if needed
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
// Ensure required environment variables are set


export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: process.env.NEXT_LINKEDIN_CLIENT_ID,
      clientSecret: process.env.NEXT_LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'w_member_social',
        },
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      console.log(`🚀 ~ account signIn:`, account)
      if (!user.email) return false;
      console.log(`🚀 ~ user:`, user)
      // NEXT_LINKEDIN_CLIENT_ID


      try {
        // Try to find existing user
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create new user
        if (!dbUser) {
          const username = user.name?.replace(/\s+/g, '_').toLowerCase() || `user_${Date.now()}`;
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: username,
              whatsappVerified: false,
            },
          });
        }


        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, trigger, account }) {
      console.log(`🚀 ~ process.env.NEXT_LINKEDIN_CLIENT_ID:`, process.env.NEXT_LINKEDIN_CLIENT_ID)
      console.log(`🚀 ~ process.env.NEXT_LINKEDIN_CLIENT_SECRET:`, process.env.NEXT_LINKEDIN_CLIENT_SECRET)
      console.log(`🚀 ~ process.env.NEXTAUTH_URL:`, process.env.NEXTAUTH_URL)
      console.log(`🚀 ~ { token, user, trigger, account }:`, { token, user, trigger, account })

      // Handle session update
      if (trigger === "update") {
        // Fetch the latest user data from the database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (dbUser) {
          // Update token with the latest user data
          token.whatsappNumber = dbUser.whatsappNumber || null;
          token.whatsappVerified = dbUser.whatsappVerified;
          // Add any other fields that need to be updated
        }

        return token;
      }

      if (user) {
        // Find the user in database with all fields
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          // Add all user information to the token
          token.id = dbUser.id;
          token.whatsappNumber = dbUser.whatsappNumber || null;
          token.whatsappVerified = dbUser.whatsappVerified;

          // Add LinkedIn tokens from the database
          token.linkedinAccessToken = dbUser.linkedinAccessToken || null;
          token.linkedinTokenExpiry = dbUser.linkedinTokenExpiry || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          whatsappNumber: token.whatsappNumber as string | null,
          whatsappVerified: token.whatsappVerified as boolean,
          linkedinAccessToken: token.linkedinAccessToken as string | null,
          linkedinTokenExpiry: token.linkedinTokenExpiry as Date | null,
        },
      };
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  events: {
    async signIn({ user }) {
      // Log successful sign-ins
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      // Log sign-outs
      console.log(`User signed out: ${token.email}`);
    },
  },
};

export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}

// Add type for the extended session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      whatsappNumber: string | null;
      whatsappVerified: boolean;
      linkedinAccessToken?: string | null;
      linkedinTokenExpiry?: Date | null;
    }
  }

  // Modify the User type for profile callbacks
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // Optional fields for database (these won't be required in profile callbacks)
    whatsappNumber?: string | null;
    whatsappVerified?: boolean;
    linkedinAccessToken?: string | null;
    linkedinTokenExpiry?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

// Add type for the extended JWT token
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    whatsappNumber: string | null;
    whatsappVerified: boolean;
    linkedinAccessToken?: string | null;
    linkedinTokenExpiry?: Date | null;
  }
}
