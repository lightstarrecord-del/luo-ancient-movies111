"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/realtime-db";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminSeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", image: "", description: "", playLink: "", downloadLink: "", category: "action" });
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
    const seriesRef = ref(db, "series");
    const unsub = onValue(seriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSeries(Object.entries(data).map(([id, value]) => ({ id, ...(value as any) })));
      } else {
        setSeries([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.title || !form.image || !form.category) return;
    if (editId) {
      await update(ref(db, `series/${editId}`), form);
      setEditId(null);
    } else {
      await set(push(ref(db, "series")), form);
    }
    setForm({ title: "", image: "", description: "", playLink: "", downloadLink: "", category: "action" });
  };
  const handleEdit = (item: any) => {
    setEditId(item.id);
    setForm({ title: item.title, image: item.image, description: item.description || "", playLink: item.playLink || "", downloadLink: item.downloadLink || "", category: item.category || "action" });
  };
  const handleDelete = async (id: string) => {
    await remove(ref(db, `series/${id}`));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Manage Series</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-900 p-4 rounded">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="playLink" value={form.playLink} onChange={handleChange} placeholder="Play Link (URL)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="downloadLink" value={form.downloadLink} onChange={handleChange} placeholder="Download Link (URL)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded bg-black text-white border border-yellow-400" required>
          {['action','indian','nollywood','cartoon','war','korean'].map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold py-2 rounded">
          {editId ? "Update Series" : "Add Series"}
        </button>
  {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", image: "", description: "", playLink: "", downloadLink: "", category: "action" }); }} className="w-full mt-2 bg-gray-700 text-white py-2 rounded">Cancel Edit</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          {series.map((item) => (
            <div key={item.id} className="flex items-center bg-gray-800 rounded p-4">
              <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded mr-4 border-2 border-yellow-400" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <p className="text-yellow-300 text-xs mt-1">Category: {item.category || 'Uncategorized'}</p>
              </div>
              <button onClick={() => handleEdit(item)} className="bg-yellow-400 text-black px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
