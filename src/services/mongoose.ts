import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const uri = process.env.MONGODB_URI!;

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
  logger.info('Mongo connected');
}
