"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "./../../../context/CartContext"; 
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, clearCart } = useCart(); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [cardNumberError, setCardNumberError] = useState("");

  // Check authentication on mount - redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please log in to checkout");
      router.push("/login?callback=/checkout");
    }
  }, [status, router]);

  // Pre-fill user details from session
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: (session.user as any).name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const totalPrice = cart.reduce((acc: number, item: any) => 
    acc + (Number(item.price) * Number(item.quantity)), 0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardNumberBlur = () => {
    const sanitized = formData.cardNumber.replace(/\D/g, "");
    if (formData.cardNumber && (sanitized.length < 13 || sanitized.length > 19)) {
      setCardNumberError("Credit card number must be 13–19 digits.");
      toast.error("Please enter a valid credit card number.");
    } else {
      setCardNumberError("");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty!");

    const sanitizedCardNumber = formData.cardNumber.replace(/\D/g, "");
    if (!sanitizedCardNumber || sanitizedCardNumber.length < 13 || sanitizedCardNumber.length > 19) {
      setCardNumberError("Credit card number must be 13–19 digits.");
      toast.error("Please enter a valid credit card number.");
      return;
    }

    if (!formData.expiryDate) {
      toast.error("Please select a credit card expiry date.");
      return;
    }

    const [year, month] = formData.expiryDate.split("-");
    const formattedExpiry = `${month}/${year.slice(-2)}`;

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formattedExpiry)) {
      toast.error("Please enter a valid credit card expiry.");
      return;
    }

    if (!/^\d{3,4}$/.test(formData.cvc)) {
      toast.error("CVC must be 3 or 4 digits.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: (session?.user as any)?.id,
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        },
        items: cart.map((item: any) => ({
          productId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
        paymentMethod: "Credit Card",
        cardLast4: sanitizedCardNumber.slice(-4),
        cardExpiry: formattedExpiry,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to create order");

      toast.success("Order Placed Successfully!");
      clearCart(); 
      router.push("/my-orders"); // Redirect to orders after success
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <>
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </button>
      </div>

      <form onSubmit={handlePayment} className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SIDE: USER INFORMATION */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact & Shipping</h2>
            <div className="grid gap-4">
              <input 
                required 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Full Name" 
                className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  type="email" 
                  placeholder="Email Address" 
                  className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                  required 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <input 
                required 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                placeholder="Shipping Address" 
                className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  placeholder="City" 
                  className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                  required 
                  name="zipCode" 
                  value={formData.zipCode} 
                  onChange={handleInputChange} 
                  placeholder="Zip Code" 
                  className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="flex gap-4 mb-6">
              <label className="flex-1 p-4 border rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-gray-50 border-blue-500 bg-blue-50/50">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                <span className="font-medium text-sm">Credit Card</span>
              </label>
              <label className="flex-1 p-4 border rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="w-4 h-4" />
                <span className="font-medium text-sm">PayPal</span>
              </label>
            </div>

            <div className="grid gap-4">
              <input
                required
                name="cardNumber"
                inputMode="numeric"
                value={formData.cardNumber}
                onChange={handleInputChange}
                onBlur={handleCardNumberBlur}
                placeholder="Card Number"
                className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              {cardNumberError && (
                <div className="mt-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {cardNumberError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="expiryDate"
                  type="month"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  required
                  name="cvc"
                  inputMode="numeric"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  placeholder="CVC"
                  className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="bg-gray-50 p-8 rounded-[2.5rem] h-fit space-y-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Review Your Items ({cart.length})</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {cart.length > 0 ? (
              cart.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-400 italic">No items found</p>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex justify-between text-2xl font-black text-gray-900">
            <span>Total Price</span>
            <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
          </div>

          <button 
            type="submit" 
            disabled={loading || cart.length === 0}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl text-lg font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing Order...
              </>
            ) : (
              `Pay $${totalPrice.toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </>
  );
}