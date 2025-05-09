// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Backend Environment Variables
    DATABASE_URL: string;
    NEXT_WHATSAPP_API_ACCESS_TOKEN: string;
  }
}
