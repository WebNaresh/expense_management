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
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string,
        },
      };
    },
  },
};

export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}
