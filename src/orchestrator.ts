import type OpenAI from 'openai';
import { chatWithTools } from './services/openai.js';
import { retrieveDocumentContext } from './tools/rag.js';
import { queryDatabase } from './tools/db.js';
import { logger } from './utils/logger.js';

const toolDefs: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'retrieveDocumentContext',
      description: 'RAG: fetch policy/FAQ/manual snippets relevant to a question',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language question' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'queryDatabase',
      description: 'Query orders database by criteria like customer, date range, product, status',
      parameters: {
        type: 'object',
        properties: {
          customerName: { type: 'string' },
          product: { type: 'string' },
          status: { type: 'string' },
          dateRange: { type: 'string', enum: ['last week', 'last month'] },
          from: { type: 'string', description: 'ISO start date' },
          to: { type: 'string', description: 'ISO end date' }
        }
      }
    }
  }
];

export async function askOrchestrator(userQuery: string) {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are an internal analytics AI assistant. Choose the appropriate tool. Be concise and include a brief explanation of what you did.'
    },
    {
      role: 'user',
      content: userQuery
    }
  ];

  const first = await chatWithTools(messages, toolDefs);
  const msg = first.choices[0].message;

  if (msg.tool_calls && msg.tool_calls.length > 0) {
    let toolResults: any[] = [];
    for (const call of msg.tool_calls) {
      const name = call.function?.name as 'retrieveDocumentContext' | 'queryDatabase';
      const args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};

      if (name === 'retrieveDocumentContext') {
        const result = await retrieveDocumentContext(String(args.query || ''));
        toolResults.push({ name, arguments: args, result });
      }
      if (name === 'queryDatabase') {
        const result = await queryDatabase(args || {});
        toolResults.push({ name, arguments: args, result });
      }
    }

    const toolMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = toolResults.map((tr, i) => ({
      role: 'tool',
      tool_call_id: msg.tool_calls![i].id,
      content: typeof tr.result === 'string' ? tr.result : JSON.stringify(tr.result)
    }));

    const final = await chatWithTools([
      ...messages,
      msg,
      ...toolMessages
    ], toolDefs);

    const finalText = final.choices[0].message.content || '';
    logger.info({
      selectedTools: toolResults.map(t => t.name),
      toolArgs: toolResults.map(t => t.arguments)
    }, 'Ask orchestrator complete');

    return {
      answer: finalText,
      tools: toolResults
    };
  }

  return { answer: msg.content || 'No answer', tools: [] };
}
