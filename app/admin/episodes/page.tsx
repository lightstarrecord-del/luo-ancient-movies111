"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/realtime-db";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [form, setForm] = useState({ seriesId: "", title: "", image: "", playLink: "", downloadLink: "" });
  const [seriesList, setSeriesList] = useState<any[]>([]);
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
    const episodesRef = ref(db, "episodes");
    const unsub = onValue(episodesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEpisodes(Object.entries(data).map(([id, value]) => ({ id, ...(value as any) })));
      } else {
        setEpisodes([]);
      }
      setLoading(false);
    });
    // Fetch series for dropdown
    const seriesRef = ref(db, "series");
    const unsubSeries = onValue(seriesRef, (snap) => {
      const data = snap.val();
      if (data) setSeriesList(Object.entries(data).map(([id, v]) => ({ id, ...(v as any) })));
      else setSeriesList([]);
    });
    return () => { unsub(); unsubSeries(); };
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.seriesId || !form.title || !form.playLink) return;
    if (editId) {
      await update(ref(db, `episodes/${editId}`), form);
      setEditId(null);
    } else {
      await set(push(ref(db, "episodes")), form);
    }
    setForm({ seriesId: "", title: "", image: "", playLink: "", downloadLink: "" });
  };
  const handleEdit = (item: any) => {
    setEditId(item.id);
    setForm({ seriesId: item.seriesId, title: item.title, image: item.image || "", playLink: item.playLink || "", downloadLink: item.downloadLink || "" });
  };
  const handleDelete = async (id: string) => {
    await remove(ref(db, `episodes/${id}`));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Manage Episodes</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-900 p-4 rounded">
        <select name="seriesId" value={form.seriesId} onChange={handleChange} className="w-full p-2 rounded bg-black text-white border border-yellow-400">
          <option value="">Select Series</option>
          {seriesList.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Episode Title" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL (optional)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="playLink" value={form.playLink} onChange={handleChange} placeholder="Play Link (URL)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="downloadLink" value={form.downloadLink} onChange={handleChange} placeholder="Download Link (URL)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold py-2 rounded">
          {editId ? "Update Episode" : "Add Episode"}
        </button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ seriesId: "", title: "", image: "", playLink: "", downloadLink: "" }); }} className="w-full mt-2 bg-gray-700 text-white py-2 rounded">Cancel Edit</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          {episodes.map((item) => (
            <div key={item.id} className="flex items-center bg-gray-800 rounded p-4">
              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-gray-300 text-sm">Series ID: {item.seriesId}</p>
                <p className="text-gray-300 text-sm">Play: {item.playLink}</p>
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
