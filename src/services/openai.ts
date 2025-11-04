import OpenAI from "openai";
import { logger } from "../utils/logger.js";

/**
 * This service supports both OpenAI and DeepSeek APIs.
 * Just fill in either OPENAI_API_KEY or DEEPSEEK_API_KEY in your .env.
 */

const provider = process.env.DEEPSEEK_API_KEY ? "deepseek" : "openai";

// Dynamically set the API base URL and key
const apiKey =
  provider === "deepseek"
    ? process.env.DEEPSEEK_API_KEY
    : process.env.OPENAI_API_KEY;

const baseURL =
  provider === "deepseek"
    ? process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"
    : process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

if (!apiKey) {
  throw new Error(
    "❌ Missing API key. Please set OPENAI_API_KEY or DEEPSEEK_API_KEY in your .env file."
  );
}

logger.info(`🧠 Using ${provider.toUpperCase()} API endpoint: ${baseURL}`);

export const openai = new OpenAI({
  apiKey,
  baseURL,
});

export const CHAT_MODEL =
  provider === "deepseek"
    ? process.env.DEEPSEEK_MODEL || "deepseek-chat"
    : process.env.OPENAI_MODEL || "gpt-4o-mini";

export const EMBEDDING_MODEL =
  provider === "deepseek"
    ? process.env.DEEPSEEK_EMBEDDING_MODEL || "deepseek-embedding"
    : process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

/**
 * Create embeddings (for Pinecone indexing)
 */
export async function embed(texts: string[]): Promise<number[][]> {
  logger.debug({ provider, count: texts.length }, "Creating embeddings");

  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return res.data.map((d) => d.embedding);
}

/**
 * Chat with function-calling / tool selection
 */
export async function chatWithTools(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  tools: any[]
) {
  logger.debug(
    { provider, toolsDefined: tools.length },
    "Running chatWithTools"
  );

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    tools,
    tool_choice: "auto",
  });

  return completion;
}
