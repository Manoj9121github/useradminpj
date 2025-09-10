import { NextResponse } from "next/server";

let orders: any[] = []; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" });
    }

    const orderId = Date.now();
    const order = { orderId, items, orderDate: new Date().toISOString() };
    orders.push(order);

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = Number(url.searchParams.get("orderId"));
  const order = orders.find(o => o.orderId === orderId);
  return NextResponse.json(order || null);
}
