# AI Assistant API (Koa + TS) — RAG (Pinecone) + Mongo (Mongoose)

This demo shows OpenAI function calling to dynamically choose between two tools:

1. **RAG Tool** (`retrieveDocumentContext`) → uses OpenAI embeddings + Pinecone
2. **DB Tool** (`queryDatabase`) → queries MongoDB via Mongoose

## Prerequisites
- Node.js 18+
- A running MongoDB (e.g. `mongodb://localhost:27017`)
- Pinecone account, API key, and an index created (`PINECONE_INDEX`)
- OpenAI API key

## Setup
```bash
cp .env.example .env
# fill all keys and names
npm install
npm run seed # seeds Pinecone and Mongo with sample data
npm run dev   # starts the API on http://localhost:3000
```

## API
**POST** `/ask`
```json
{ "query": "User's question here" }
```

### Examples
1) RAG (policy):
```bash
curl -s -X POST http://localhost:3000/ask   -H 'Content-Type: application/json'   -d '{"query":"What does the refund policy say about cancellations?"}' | jq
```

2) DB (orders last week):
```bash
curl -s -X POST http://localhost:3000/ask   -H 'Content-Type: application/json'   -d '{"query":"Find all orders from Sarah last week."}' | jq
```

### Sample Response
```json
{
  "answer": "I looked up orders for Sarah in the last 7 days and found 1 matching document...",
  "tools": [
    {
      "name": "queryDatabase",
      "arguments": { "customerName": "Sarah", "dateRange": "last week" },
      "result": [ { "orderId": "A1002", "status": "refunded" } ]
    }
  ]
}
```

## Notes
- Structured logs via **pino**.
- A tiny in-memory cache stores embedding-based RAG results briefly (10 min).
- You can swap Chat Completions for the Responses API if preferred.

## Bonus Ideas
- Add Redis for persistent caching
- Add rate limiting & request id tracing
- Add a minimal web UI (single page) posting to `/ask`
