
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const raw = await fetch(
      "https://raw.githubusercontent.com/Manoj9121github/user-admin-ecomdata/main/products.json",
      { cache: "no-store" }
    );
    if (!raw.ok) throw new Error(`Failed to fetch raw file: ${raw.status}`);
    const data = await raw.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("getStore error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
