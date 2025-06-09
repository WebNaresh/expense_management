import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedIn({
      clientId: process.env.NEXT_LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.NEXT_LINKEDIN_CLIENT_SECRET!,
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
          scope: "openid profile email w_member_social",
        },
      },
      token: "https://www.linkedin.com/oauth/v2/accessToken",
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
        };
      },
    })

  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      console.log(`🚀 ~ account signIn:`, account);
      if (!user.email) return false;
      console.log(`🚀 ~ user:`, user);
      try {
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
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
      console.log(`🚀 ~ process.env.NEXT_LINKEDIN_CLIENT_ID:`, process.env.NEXT_LINKEDIN_CLIENT_ID);
      console.log(`🚀 ~ process.env.NEXT_LINKEDIN_CLIENT_SECRET:`, process.env.NEXT_LINKEDIN_CLIENT_SECRET);
      console.log(`🚀 ~ process.env.NEXTAUTH_URL:`, process.env.NEXTAUTH_URL);
      console.log(`🚀 ~ { token, user, trigger, account }:`, { token, user, trigger, account });

      if (account?.provider === "linkedin") {
        token.linkedinAccessToken = account.access_token;
        token.linkedinTokenExpiry = account.expires_at ? new Date(account.expires_at * 1000) : null;
      }

      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) {
          token.whatsappNumber = dbUser.whatsappNumber || null;
          token.whatsappVerified = dbUser.whatsappVerified;
        }
        return token;
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (dbUser) {
          token.id = dbUser.id;
          token.whatsappNumber = dbUser.whatsappNumber || null;
          token.whatsappVerified = dbUser.whatsappVerified;
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
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
  },
};

export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}

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
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    whatsappNumber?: string | null;
    whatsappVerified?: boolean;
    linkedinAccessToken?: string | null;
    linkedinTokenExpiry?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    whatsappNumber: string | null;
    whatsappVerified: boolean;
    linkedinAccessToken?: string | null;
    linkedinTokenExpiry?: Date | null;
  }
}
