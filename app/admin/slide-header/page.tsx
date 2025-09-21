"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/realtime-db";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminSlideHeaderPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [form, setForm] = useState({ image: "", link: "", title: "" });
  const [editId, setEditId] = useState<string | null>(null);
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
    const slidesRef = ref(db, "slideHeaders");
    const unsub = onValue(slidesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSlides(Object.entries(data).map(([id, value]) => ({ id, ...(value as any) })));
      } else {
        setSlides([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.image) return;
    if (editId) {
      await update(ref(db, `slideHeaders/${editId}`), form);
      setEditId(null);
    } else {
      await set(push(ref(db, "slideHeaders")), form);
    }
    setForm({ image: "", link: "", title: "" });
  };
  const handleEdit = (slide: any) => {
    setEditId(slide.id);
    setForm({ image: slide.image, link: slide.link || "", title: slide.title || "" });
  };
  const handleDelete = async (id: string) => {
    await remove(ref(db, `slideHeaders/${id}`));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Manage Slide Header Images</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-900 p-4 rounded">
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title (optional)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="link" value={form.link} onChange={handleChange} placeholder="Link (optional)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold py-2 rounded">
          {editId ? "Update Slide" : "Add Slide"}
        </button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ image: "", link: "", title: "" }); }} className="w-full mt-2 bg-gray-700 text-white py-2 rounded">Cancel Edit</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center bg-gray-800 rounded p-4">
              <img src={slide.image} alt={slide.title} className="w-24 h-16 object-cover rounded mr-4 border-2 border-yellow-400" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{slide.title}</h2>
                <p className="text-gray-300 text-sm">{slide.link}</p>
              </div>
              <button onClick={() => handleEdit(slide)} className="bg-yellow-400 text-black px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(slide.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
