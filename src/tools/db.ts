import { connectMongo } from '../services/mongoose.js';
import { OrderModel } from '../models/Order.js';
import { logger } from '../utils/logger.js';

export async function queryDatabase(criteria: Record<string, any>): Promise<any[]> {
  await connectMongo();

  const filter: any = {};
  if (criteria.customerName) filter.customerName = new RegExp(`^${criteria.customerName}$`, 'i');
  if (criteria.product) filter.product = new RegExp(criteria.product, 'i');
  if (criteria.status) filter.status = criteria.status;

  if (criteria.dateRange) {
    const now = new Date();
    let from = new Date(0);
    if (criteria.dateRange === 'last week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      from = d;
    }
    if (criteria.dateRange === 'last month') {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      from = d;
    }
    filter.createdAt = { $gte: from, $lte: now };
  }

  if (criteria.from || criteria.to) {
    filter.createdAt = {
      ...(filter.createdAt || {}),
      ...(criteria.from ? { $gte: new Date(criteria.from) } : {}),
      ...(criteria.to ? { $lte: new Date(criteria.to) } : {})
    };
  }

  const docs = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
  logger.debug({ count: docs.length, filter }, 'DB query executed');
  return docs;
}
