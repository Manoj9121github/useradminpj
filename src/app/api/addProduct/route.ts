import { NextResponse } from "next/server";

const REPO = process.env.GITHUB_REPO!;
const FILE_PATH = process.env.GITHUB_FILE!;
const TOKEN = process.env.GITHUB_TOKEN!;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  date: string;
}

interface StoreFile {
  products: Product[];
  orders: unknown[]; // keep unknown instead of any
}

export async function POST(req: Request) {
  try {
    // parse body
    const body = await req.json() as { 
      name: string; 
      category: string; 
      price: number | string; 
      quantity: number | string; 
    };

    const newProduct: Product = {
      id: Date.now(),
      name: body.name,
      category: body.category,
      price: Number(body.price),
      quantity: Number(body.quantity),
      date: new Date().toISOString().slice(0, 10),
    };

    // fetch current file from GitHub
    const fileRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github.v3+json" },
      }
    );

    if (!fileRes.ok) {
      const txt = await fileRes.text();
      throw new Error(`GitHub GET failed: ${fileRes.status} — ${txt}`);
    }

    const fileJson: { content: string; sha: string } = await fileRes.json();

    const decoded = Buffer.from(fileJson.content, "base64").toString("utf8");
    const doc: StoreFile = JSON.parse(decoded);

    if (!doc.products) doc.products = [];
    if (!doc.orders) doc.orders = [];

    doc.products.push(newProduct);

    const updatedContent = Buffer.from(JSON.stringify(doc, null, 2)).toString("base64");

    const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({
        message: `Add product ${newProduct.name}`,
        content: updatedContent,
        sha: fileJson.sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) throw new Error(`GitHub PUT failed`);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("addProduct error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
