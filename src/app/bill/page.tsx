'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

export default function BillPageContent() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get('orderId'));
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/addOrder?orderId=${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch((err) => {
        console.error(err);
        setError('Could not load order.');
      });
  }, [orderId]);

  if (error)
    return <p className="text-center mt-6 text-red-500">{error}</p>;

  if (!order)
    return <p className="text-center mt-6">Loading bill...</p>;

  // ✅ safe reduce
  const subtotal = (order.items ?? []).reduce(
    (acc, i) => acc + i.price * i.selectedQty,
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="p-6 max-w-md mx-auto border rounded shadow bg-white mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Bill - Order #{order.orderId}
      </h2>
      <ul className="mb-4 space-y-2">
        {order.items?.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.selectedQty}
            </span>
            <span>₹{item.price * item.selectedQty}</span>
          </li>
        ))}
      </ul>

      <hr className="my-2" />
      <div className="flex justify-between font-bold text-lg mt-1">
        <span>Total:</span> <span>₹{total.toFixed(2)}</span>
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Order Date: {new Date(order.orderDate).toLocaleString()}
      </p>
    </div>
  );
}
