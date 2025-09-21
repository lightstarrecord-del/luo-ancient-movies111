"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/realtime-db";
import { ref, onValue, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminSiteContentPage() {
  const [content, setContent] = useState({ header: "", about: "", contact: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "lightstarrecord@gmail.com") router.push("/admin");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    setLoading(true);
    const contentRef = ref(db, "siteContent");
    const unsub = onValue(contentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setContent(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleChange = (e: any) => setContent({ ...content, [e.target.name]: e.target.value });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await set(ref(db, "siteContent"), content);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Manage Site Content</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-900 p-4 rounded">
        <input name="header" value={content.header} onChange={handleChange} placeholder="Header Text" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <textarea name="about" value={content.about} onChange={handleChange} placeholder="About Section" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <textarea name="contact" value={content.contact} onChange={handleChange} placeholder="Contact Info" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold py-2 rounded">Save Content</button>
      </form>
      {loading && <div>Loading...</div>}
    </div>
  );
}
