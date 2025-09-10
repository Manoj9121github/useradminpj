"use client";
import { useState } from "react";

interface FormState {
  name: string;
  category: string;
  price: string;
  quantity: string;
}

export default function AdminPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [msg, setMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("Adding...");
    try {
      const res = await fetch("/api/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success && data.product?.name) {
        setMsg("✅ Added: " + data.product.name);
      } else {
        setMsg("❌ " + (data.error ?? "Unknown error"));
      }
    } catch (err: unknown) {
      setMsg("❌ Network error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg hover:scale-105 transform transition duration-300">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            type="number"
            className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
          >
            Add Product
          </button>
        </form>

        {msg && (
          <p
            className={`mt-5 text-center font-medium ${
              msg.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
