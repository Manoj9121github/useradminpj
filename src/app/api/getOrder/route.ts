import { NextResponse } from "next/server";

// Define CartItem and Order types
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
  customer?: string;
  status?: string;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderIdParam = url.searchParams.get("orderId");
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  if (!orderId) {
    return NextResponse.json(
      { error: "No orderId provided" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Manoj9121github/user-admin-ecomdata/main/data.json",
      { cache: "no-store" }
    );

    const data: { orders?: Order[] } = await res.json();
    const order = data.orders?.find((o) => o.orderId === orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("getOrder error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
