import { Schema, model, InferSchemaType } from 'mongoose';

const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, index: true },
  product: String,
  amount: Number,
  status: String,
  createdAt: { type: Date, index: true }
}, { timestamps: true });

export type Order = InferSchemaType<typeof OrderSchema>;
export const OrderModel = model<Order>('Order', OrderSchema);
