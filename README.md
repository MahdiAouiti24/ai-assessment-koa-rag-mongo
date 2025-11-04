# 🧠 AI Assistant API — OpenAI Function Calling + Pinecone + MongoDB  
**Tech Stack:** Node.js · TypeScript · Koa.js · OpenAI API · Pinecone · MongoDB · Mongoose  

---

## 📋 Overview
This project implements an **AI-powered backend service** that uses **OpenAI function calling** to dynamically choose between two tools:

1. 🧩 **RAG Tool** — *Retrieval-Augmented Generation*  
   → Uses OpenAI embeddings and **Pinecone** vector search to answer questions about a document or policy.  

2. 💾 **Database Tool** — *Structured Querying*  
   → Uses **Mongoose (MongoDB)** to retrieve structured business data (e.g., orders).  

The model interprets a user query, decides which tool to call, executes it, and composes a final natural-language response.

---

## ⚙️ Architecture Overview
```
Koa Server
   └── POST /ask
         ↓
   Orchestrator (OpenAI Function Calling)
         ↓
 ┌─────────────────────────────┐
 │     OpenAI Model (gpt-4o)   │
 │     - Chooses Function       │
 └─────────────────────────────┘
        ↓                     ↓
 RAG Tool (Pinecone)     DB Tool (Mongo)
  - Embeddings Search     - Mongoose Query
  - Document Context       - JSON Records
```

---

## 🧩 Features
✅ Dynamic OpenAI function calling  
✅ RAG search with Pinecone  
✅ MongoDB queries with Mongoose  
✅ Structured logging (`pino`)  
✅ Lightweight in-memory caching for embeddings  
✅ TypeScript + Modular architecture  
✅ Tested with `curl` requests  

---

## 🧰 Project Structure
```
src/
├── index.ts            → Koa app entry point
├── routes/ask.ts       → /ask endpoint
├── orchestrator.ts     → OpenAI function orchestration
├── tools/
│   ├── rag.ts          → RAG (Pinecone) tool
│   └── db.ts           → MongoDB tool
├── services/
│   ├── openai.ts       → OpenAI embeddings / completions
│   ├── pinecone.ts     → Pinecone setup
│   └── mongoose.ts     → MongoDB connection
├── utils/
│   ├── logger.ts       → pino logging
│   └── cache.ts        → simple in-memory cache
└── seed/seed.ts        → Seeds sample Pinecone + MongoDB data
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MahdiAouiti24/ai-assessment-koa-rag-mongo.git
cd ai-assessment-koa-rag-mongo
```

### 2️⃣ Environment Variables
```bash
cp .env.example .env
```

Fill in your keys:
```
OPENAI_API_KEY=your-openai-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX=my-assessment-index
PINECONE_NAMESPACE=default
MONGODB_URI=mongodb://127.0.0.1:27017/ai_assessment
```

> ⚠️ `.env` is ignored in Git; never commit it.

---

## 🧱 Seeding Data
Before running, populate MongoDB and Pinecone with demo data:
```bash
npm install
npm run seed
```
This inserts:
- Policy snippets into Pinecone (for RAG)
- Example orders into MongoDB (for DB tool)

---

## ▶️ Run the API
```bash
npm run dev
```
Server starts at:  
👉 http://localhost:3000  

---

## 🧾 Example Queries

### 🧩 RAG Tool — (Pinecone)
```bash
curl -s -X POST http://localhost:3000/ask   -H "Content-Type: application/json"   -d '{"query":"What does the refund policy say about cancellations?"}'
```

### 💾 Database Tool — (Mongo)
```bash
curl -s -X POST http://localhost:3000/ask   -H "Content-Type: application/json"   -d '{"query":"Find all orders from Sarah last week."}'
```

---

## 💬 Example Responses

### RAG Example
```json
{
  "answer": "Cancellations made within 24 hours of purchase receive a full refund...",
  "tools": [
    {
      "name": "retrieveDocumentContext",
      "arguments": { "query": "refund policy cancellations" }
    }
  ]
}
```

### DB Example
```json
{
  "answer": "I found one order from Sarah last week...",
  "tools": [
    {
      "name": "queryDatabase",
      "arguments": { "customerName": "Sarah", "dateRange": "last week" }
    }
  ]
}
```

---

## 🧩 Logs Example
Example logs (via `pino`):
```
[INFO] 🧠 Using OPENAI API endpoint: https://api.openai.com/v1
[DEBUG] Creating embeddings provider="openai" count=4
[INFO] ✅ Seeded Pinecone vectors count=4
[INFO] ✅ MongoDB connected on localhost:27017
```

---

## 🧠 Bonus Implementations
✅ Structured logging with `pino`  
✅ In-memory caching for RAG results  
✅ Clean modular TypeScript design  
✅ `curl` examples in README  

---

## 📦 Tech Stack
- Node.js 18+
- Koa.js
- TypeScript
- OpenAI API (Chat + Embeddings)
- Pinecone Vector DB
- MongoDB + Mongoose
- Pino (structured logging)

---

## 📤 Submission
- Repository: [https://github.com/MahdiAouiti24/ai-assessment-koa-rag-mongo](https://github.com/MahdiAouiti24/ai-assessment-koa-rag-mongo)
- Tested locally on: **Ubuntu 22.04 / Node 18 / MongoDB via Docker**

---

## 👨‍💻 Author
**Mahdi Aouiti**  

