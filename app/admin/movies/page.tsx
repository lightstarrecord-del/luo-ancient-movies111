"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/realtime-db";
import ALLOWED_CATEGORIES from '@/lib/categories';
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", image: "", description: "", playLink: "", downloadLink: "", category: ALLOWED_CATEGORIES[0] });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "lightstarrecord@gmail.com") router.push("/admin");
    });
    return () => unsub();
  }, [router]);

  // Load movies
  useEffect(() => {
    setLoading(true);
    const moviesRef = ref(db, "movies");
    const unsub = onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMovies(Object.entries(data).map(([id, value]) => ({ id, ...(value as any) })));
      } else {
        setMovies([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Handle form
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.title || !form.image || !form.category) return;
    if (editId) {
      await update(ref(db, `movies/${editId}`), form);
      setEditId(null);
    } else {
      await set(push(ref(db, "movies")), form);
    }
  setForm({ title: "", image: "", description: "", playLink: "", downloadLink: "", category: ALLOWED_CATEGORIES[0] });
  };
  const handleEdit = (movie: any) => {
    setEditId(movie.id);
    setForm({
      title: movie.title,
      image: movie.image,
      description: movie.description || "",
      playLink: movie.playLink || "",
      downloadLink: movie.downloadLink || "",
  category: movie.category || ALLOWED_CATEGORIES[0]
    });
  };
  const handleDelete = async (id: string) => {
    await remove(ref(db, `movies/${id}`));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Manage Movies</h1>
  <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-900 p-4 rounded">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="playLink" value={form.playLink} onChange={handleChange} placeholder="Play Link (URL)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <input name="downloadLink" value={form.downloadLink} onChange={handleChange} placeholder="Download Link (URL)" className="w-full p-2 rounded bg-black text-white border border-yellow-400" />
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded bg-black text-white border border-yellow-400" required>
          {ALLOWED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold py-2 rounded">
          {editId ? "Update Movie" : "Add Movie"}
        </button>
  {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", image: "", description: "", playLink: "", downloadLink: "", category: ALLOWED_CATEGORIES[0] }); }} className="w-full mt-2 bg-gray-700 text-white py-2 rounded">Cancel Edit</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex items-center bg-gray-800 rounded p-4">
              <img src={movie.image} alt={movie.title} className="w-16 h-24 object-cover rounded mr-4 border-2 border-yellow-400" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{movie.title}</h2>
                <p className="text-gray-300 text-sm">{movie.description}</p>
              </div>
              <button onClick={() => handleEdit(movie)} className="bg-yellow-400 text-black px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(movie.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
