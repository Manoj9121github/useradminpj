
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = Number(searchParams.get("orderId"));
  if (!orderId) return NextResponse.json({ error: "No orderId provided" }, { status: 400 });

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Manoj9121github/user-admin-ecomdata/main/data.json",
      { cache: "no-store" }
    );
    const data = await res.json();
    const order = data.orders?.find((o: any) => o.orderId === orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("getOrder error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
