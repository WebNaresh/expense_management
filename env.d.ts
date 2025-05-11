// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Backend Environment Variables
    DATABASE_URL: string;
    NEXT_WHATSAPP_API_ACCESS_TOKEN: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
    NODE_ENV: "development" | "production";
    NEXT_OPEN_AI_API_KEY: string;
    NEXT_AUTH_URL: string;
    NEXT_PUBLIC_SECRET: string;
    NEXT_WHATSAPP_PHONE_NUMBER_ID: string;
    NEXT_LINKEDIN_CLIENT_ID: string;
    NEXT_LINKEDIN_CLIENT_SECRET: string;
  }
}
