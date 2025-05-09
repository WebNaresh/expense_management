import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth"; // Import User type if needed
import Google from "next-auth/providers/google";

// Ensure required environment variables are set
if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID');
if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET) throw new Error('Missing GOOGLE_CLIENT_SECRET');
if (!process.env.NEXT_PUBLIC_SECRET) throw new Error('Missing NEXT_PUBLIC_SECRET');

// Ensure NEXT_AUTH_URL is set in production
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_AUTH_URL) {
  throw new Error('Missing NEXT_AUTH_URL in production environment');
}

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

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
              whatsappNumber: username, // Using username as temporary whatsapp number
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // Find the user in database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            name: true,
            email: true,
            whatsappNumber: true,
          },
        });

        if (dbUser) {
          // Add user information to the token
          token.id = dbUser.id;
          token.whatsappNumber = dbUser.whatsappNumber;
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
          whatsappNumber: token.whatsappNumber as string,
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
      whatsappNumber: string;
    }
  }
}

// Add type for the extended JWT token
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    whatsappNumber: string;
  }
}
