import { embed } from '../services/openai.js';
import { pineconeIndex, PINECONE_NAMESPACE } from '../services/pinecone.js';
import { logger } from '../utils/logger.js';
import { getCache, setCache } from '../utils/cache.js';

const TOP_K = 5;

export async function retrieveDocumentContext(query: string): Promise<string> {
  const cacheKey = `rag:${query}`;
  const cached = getCache<string>(cacheKey);
  if (cached) return cached;

  const [qEmbedding] = await embed([query]);
  const res = await pineconeIndex.namespace(PINECONE_NAMESPACE).query({
    topK: TOP_K,
    vector: qEmbedding,
    includeMetadata: true
  });

  const snippets = (res.matches || [])
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map(m => (m.metadata?.text as string) || '')
    .filter(Boolean);

  const context = snippets.join('\n---\n');
  logger.debug({ topK: snippets.length }, 'RAG retrieved snippets');
  setCache(cacheKey, context, 600);
  return context || 'No relevant context found.';
}
