"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Redirect if already logged in as admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "lightstarrecord@gmail.com") {
        router.push("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (userCred.user.email === "lightstarrecord@gmail.com") {
        router.push("/admin/dashboard");
      } else {
        setError("Access denied: Not an admin email.");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === "lightstarrecord@gmail.com") {
        router.push("/admin/dashboard");
      } else {
        setError("Access denied: Not an admin email.");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Login with Google"}
        </button>
      </form>
    </div>
  );
}
