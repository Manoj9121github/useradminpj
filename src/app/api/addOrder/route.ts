import { NextResponse } from "next/server";

// Define types
interface CartItem {
  id: number;
  name: string;
  price: number;
  selectedQty: number;
}

interface Order {
  orderId: number;
  items: CartItem[];
  orderDate: string;
}

// In-memory orders array
const orders: Order[] = [];

// POST - add a new order
export async function POST(req: Request) {
  try {
    const body: { items: CartItem[] } = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" });
    }

    const orderId = Date.now(); // simple unique ID
    const order: Order = {
      orderId,
      items,
      orderDate: new Date().toISOString(),
    };

    orders.push(order);

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message });
  }
}

// GET - fetch an order by orderId
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = Number(url.searchParams.get("orderId"));
  const order = orders.find((o) => o.orderId === orderId);
  return NextResponse.json(order || null);
}
