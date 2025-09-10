"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  if (cart.length === 0)
    return (
      <div className="p-6 max-w-md mx-auto border rounded shadow bg-white mt-6 text-center">
        <p>Your cart is empty!</p>
      </div>
    );

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.selectedQty, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.success && data.order?.orderId) {
        clearCart();
        router.push(`/bill?orderId=${data.order.orderId}`);
      } else {
        alert(`Payment failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed due to network/server error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded shadow bg-white mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>

      <ul className="mb-4 space-y-2">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.selectedQty}
            </span>
            <span>₹{(item.price * item.selectedQty).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <hr className="my-2" />

      <div className="space-y-1 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (18%):</span> <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-1">
          <span>Total:</span> <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm transition"
      >
        Pay Now
      </button>
    </div>
  );
}
