import { NextResponse } from "next/server";

// Define the Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  date?: string;
  image?: string;
}

// Type for the JSON file structure
interface StoreFile {
  products: Product[];
  orders?: any[]; // Orders can stay as any[] if structure varies
}

export async function GET() {
  try {
    const raw = await fetch(
      "https://raw.githubusercontent.com/Manoj9121github/user-admin-ecomdata/main/products.json",
      { cache: "no-store" }
    );

    if (!raw.ok) throw new Error(`Failed to fetch raw file: ${raw.status}`);

    const data: StoreFile = await raw.json();

    // Ensure products array exists
    if (!data.products) data.products = [];

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("getStore error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
