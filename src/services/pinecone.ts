import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
export const pineconeIndex = pc.index(process.env.PINECONE_INDEX!);
export const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'default';
