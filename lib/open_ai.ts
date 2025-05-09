
import { OpenAI } from "openai";
export const openai = new OpenAI({
    apiKey: process.env.NEXT_OPEN_AI_API_KEY,
});
