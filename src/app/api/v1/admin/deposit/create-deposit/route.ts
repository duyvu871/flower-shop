import { NextRequest } from 'next/server';
import { createPurchaseOrder } from '@/lib/purchase/createPurchaseOrder';

export async function POST(req: NextRequest) {
	const payload = await req.json();
	const { amount, isPaid, items, _id, paymentMethod } = payload;

	return createPurchaseOrder(amount, _id, isPaid, items, paymentMethod);
}
