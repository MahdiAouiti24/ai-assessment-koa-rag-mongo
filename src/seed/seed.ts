import 'dotenv/config';
import { embed } from '../services/openai.js';
import { pineconeIndex, PINECONE_NAMESPACE } from '../services/pinecone.js';
import { connectMongo } from '../services/mongoose.js';
import { OrderModel } from '../models/Order.js';
import { logger } from '../utils/logger.js';

// ✅ Sample policy text snippets to embed into Pinecone
const policySnippets = [
  'Refunds are issued within 5–7 business days after cancellation confirmation.',
  'Cancellations made within 24 hours of purchase receive a full refund.',
  'Orders shipped cannot be cancelled; please initiate a return instead.',
  'Digital products are refundable only if unused and within 14 days.'
];

// ✅ Seed Pinecone vector index
async function seedPinecone() {
  logger.info('Starting Pinecone seeding...');

  // Generate embeddings via OpenAI
  const vectors = await embed(policySnippets);
  logger.debug({ count: vectors.length }, 'Creating embeddings');

  // ✅ Pinecone v4 SDK: pass array directly (no { vectors: [...] })
  await pineconeIndex.namespace(PINECONE_NAMESPACE).upsert(
    vectors.map((v, i) => ({
      id: `policy-${i + 1}`,
      values: v,
      metadata: { text: policySnippets[i] }
    }))
  );

  logger.info({ count: policySnippets.length }, '✅ Seeded Pinecone vectors');
}

// ✅ Seed MongoDB with example orders
async function seedMongo() {
  logger.info('Starting MongoDB seeding...');
  await connectMongo();

  await OrderModel.deleteMany({});
  await OrderModel.insertMany([
    {
      orderId: 'A1001',
      customerName: 'John Smith',
      product: 'Pro Plan',
      amount: 99,
      status: 'paid',
      createdAt: new Date()
    },
    {
      orderId: 'A1002',
      customerName: 'Sarah',
      product: 'Starter Plan',
      amount: 29,
      status: 'refunded',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000)
    },
    {
      orderId: 'A1003',
      customerName: 'Sarah',
      product: 'Add-on: Analytics',
      amount: 10,
      status: 'paid',
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000)
    },
    {
      orderId: 'A1004',
      customerName: 'John Smith',
      product: 'Add-on: Seats',
      amount: 20,
      status: 'paid',
      createdAt: new Date(Date.now() - 32 * 24 * 3600 * 1000)
    }
  ]);

  logger.info('✅ Seeded MongoDB orders');
}

// ✅ Run seeding tasks
(async () => {
  try {
    await seedPinecone();
    await seedMongo();
    logger.info('🎉 Seeding complete');
  } catch (err) {
    logger.error({ err }, '❌ Seeding failed');
  } finally {
    process.exit(0);
  }
})();
