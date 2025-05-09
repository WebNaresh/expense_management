import { User as PrismaUser } from "@prisma/client";
import "next-auth";

// These type definitions should match what's defined in your Prisma schema
declare module "next-auth" {
  interface User extends PrismaUser { }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      whatsappNumber: string;
      whatsappVerified: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    whatsappNumber: string;
    whatsappVerified: boolean;
  }
}

