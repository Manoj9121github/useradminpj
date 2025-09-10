"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function UserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch("/api/getStore")
      .then(res => res.json())
      .then(data => setProducts(data.products ?? []));
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between transform hover:scale-105 transition duration-300"
          >
            <div className="flex flex-col items-center">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-contain mb-3 rounded"
                />
              )}
              <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
              <p className="text-gray-600 text-sm mb-1">Category: {p.category}</p>
              <p className="text-gray-700 font-medium mb-1">Price: ₹{p.price}</p>
              <p className="text-gray-500 mb-2">Stock: {p.quantity}</p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min={1}
                max={p.quantity}
                defaultValue={1}
                className="border p-1 w-16 rounded"
                onChange={e => addToCart(p, Number(e.target.value))}
              />
              <button
                onClick={() => addToCart(p, 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow-sm transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-green-50 max-w-md mx-auto shadow">
          <h3 className="font-bold mb-2">Cart ({cart.length} items)</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} × {item.selectedQty} = ₹{item.price * item.selectedQty}
              </li>
            ))}
          </ul>

          <Link
            href={{
              pathname: "/payment",
            }}
            className="mt-4 block bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow-sm text-center transition"
          >
            Proceed to Payment
          </Link>
        </div>
      )}
    </div>
  );
}
