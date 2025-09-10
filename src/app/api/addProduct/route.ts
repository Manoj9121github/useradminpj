import { NextResponse } from "next/server";

const REPO = process.env.GITHUB_REPO!;
const FILE_PATH = process.env.GITHUB_FILE!;
const TOKEN = process.env.GITHUB_TOKEN!;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

// Type for the JSON file structure
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
  orders: any[]; // Keep as any[] if orders structure varies
}

export async function POST(req: Request) {
  try {
    const body: { name: string; category: string; price: number | string; quantity: number | string } = await req.json();

    const newProduct: Product = {
      id: Date.now(),
      name: body.name,
      category: body.category,
      price: Number(body.price),
      quantity: Number(body.quantity),
      date: new Date().toISOString().slice(0, 10),
    };

    // 1. Fetch current file from GitHub
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

    // 2. Decode content
    const decoded = Buffer.from(fileJson.content, "base64").toString("utf8");
    const doc: StoreFile = JSON.parse(decoded);

    // Ensure proper structure
    if (!doc.products) doc.products = [];
    if (!doc.orders) doc.orders = [];

    // 3. Add new product
    doc.products.push(newProduct);

    // 4. Encode and PUT back
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

    const putText = await putRes.text();
    console.log("PUT result:", putText);

    if (!putRes.ok) throw new Error(`GitHub PUT failed`);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("addProduct error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
