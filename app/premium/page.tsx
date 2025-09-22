
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  { id: "access2days", label: "2 Days", price: 5000 },
  { id: "week", label: "1 Week", price: 10000 },
  { id: "twoweeks", label: "2 Weeks", price: 17000 },
  { id: "month", label: "1 Month", price: 30000 },
  { id: "threemonth", label: "3 Months", price: 70000 },
  { id: "sixmonth", label: "6 Months", price: 120000 },
  { id: "year", label: "1 Year", price: 200000 },
];

export default function PremiumPage() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChoose = (plan: any) => {
    // Require login before selecting a plan
    if (!user) {
      // send user to login page
      window.location.href = '/login'
      return
    }
    setSelectedPlan(plan);
    setShowModal(true);
    setPhone("");
    setEmail("");
    setError("");
  };

  // Ensure user is authenticated (Firebase)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { getAuth } = await import('firebase/auth');
        const { app } = await import('@/lib/firebase');
        const auth = getAuth(app as any);
        const unsub = auth.onAuthStateChanged((u: any) => {
          if (!mounted) return;
          setUser(u || null);
          if (!u) {
            // redirect to login when attempting to open modal
          }
        });
        return () => { mounted = false; unsub(); };
      } catch (e) {
        console.error('Auth not initialized', e);
      }
    })();
  }, []);

  const handlePay = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // require logged in user
      if (!user) {
        setError('You must be logged in to subscribe.');
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();
      const res = await fetch("/api/pesapal/pay-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ planId: selectedPlan.id, phone, email }),
      });
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setError(data.error || "Failed to start payment");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">LUO ANCIENT PREMIUM</h1>
          <p className="text-gray-400 text-lg">Unlock unlimited access to ancient movies and exclusive content</p>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.slice(0, 4).map((plan, idx) => (
            <Card key={plan.id} className={
              plan.id === "month"
                ? "bg-gray-900 border-yellow-400 border-2 relative"
                : "bg-gray-900 border-gray-800"
            }>
              {plan.id === "month" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white">{plan.label}</CardTitle>
                <CardDescription className="text-gray-400">{idx === 0 ? "Quick access trial" : idx === 1 ? "Perfect for short-term access" : idx === 2 ? "Extended viewing period" : "Best value for regular viewers"}</CardDescription>
                <div className="text-2xl font-bold text-yellow-400">UGX {plan.price.toLocaleString()}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {/* ...features... */}
                  <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-2" />HD Quality Streaming</li>
                  <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-2" />Access to Movies</li>
                  <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-2" />{idx === 0 ? "Limited Ads" : idx === 1 ? "Reduced Ads" : idx === 2 ? "Minimal Ads" : "No Ads"}</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold" onClick={() => handleChoose(plan)}>
                  Choose {plan.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.slice(4).map((plan, idx) => (
            <Card key={plan.id} className={
              plan.id === "year"
                ? "bg-gray-900 border-purple-500 border-2 relative"
                : "bg-gray-900 border-gray-800"
            }>
              {plan.id === "year" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white">{plan.label}</CardTitle>
                <CardDescription className="text-gray-400">{idx === 0 ? "Great for movie enthusiasts" : idx === 1 ? "Extended premium experience" : "Ultimate annual package"}</CardDescription>
                <div className="text-2xl font-bold text-yellow-400">UGX {plan.price.toLocaleString()}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {/* ...features... */}
                  <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-2" />4K/8K Streaming</li>
                  <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-2" />Unlimited Movies & Shows</li>
                  <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-2" />No Ads + Exclusive Content</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold" onClick={() => handleChoose(plan)}>
                  Choose {plan.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal for phone/email input */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4 text-yellow-400">Subscribe: {selectedPlan?.label}</h2>
              <form onSubmit={handlePay} className="flex flex-col gap-4">
                <input type="text" placeholder="Phone (07XXXXXXXX)" value={phone} onChange={e => setPhone(e.target.value)} className="p-2 rounded bg-gray-800 text-white" required pattern="07[0-9]{8}" />
                <input type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} className="p-2 rounded bg-gray-800 text-white" />
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <Button type="submit" className="bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500" disabled={loading}>
                  {loading ? "Processing..." : `Pay UGX ${selectedPlan?.price.toLocaleString()}`}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
