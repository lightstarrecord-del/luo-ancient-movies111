"use client";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/lib/realtime-db";
import { ref as dbRef, onValue, push, update, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function SlideImagesAdmin() {
  const [slides, setSlides] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const slidesRef = dbRef(db, "slideImages");
    const unsub = onValue(slidesRef, (snap) => {
      const data = snap.val();
      if (data) setSlides(Object.entries(data).map(([id, v]) => ({ id, ...(v as any) })));
      else setSlides([]);
    });
    // Auth state
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => { unsub(); unsubAuth(); };
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    let url = "";
    if (useUrl) {
      if (!imageUrl) { setUploading(false); return; }
      url = imageUrl;
    } else {
      if (!image) { setUploading(false); return; }
      const storage = getStorage();
      const imgRef = storageRef(storage, `slideImages/${Date.now()}_${image.name}`);
      await uploadBytes(imgRef, image);
      url = await getDownloadURL(imgRef);
    }
    await push(dbRef(db, "slideImages"), { title, link, image: url });
    setTitle(""); setLink(""); setImage(null); setImageUrl("");
    if (fileInput.current) fileInput.current.value = "";
    setUploading(false);
  }

  async function handleDelete(id: string, imgUrl: string) {
    if (!window.confirm("Delete this slide?")) return;
    await remove(dbRef(db, `slideImages/${id}`));
    if (imgUrl) {
      const storage = getStorage();
      const imgRef = storageRef(storage, imgUrl.replace(/^.*\/o\//, ""));
      try { await deleteObject(imgRef); } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-2 text-yellow-400">Manage Slide Header Images</h1>
      <div className="mb-6 text-sm text-gray-300">
        <span>Logged in as: </span>
        <span className="font-mono text-yellow-300">{user?.email || "(not logged in)"}</span>
      </div>
      <form onSubmit={handleUpload} className="mb-8 flex flex-col gap-4 max-w-md">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="p-2 rounded bg-gray-800" required />
        <input type="text" placeholder="Link (optional)" value={link} onChange={e => setLink(e.target.value)} className="p-2 rounded bg-gray-800" />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useUrl} onChange={e => setUseUrl(e.target.checked)} />
            Use image URL
          </label>
        </div>
        {useUrl ? (
          <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="p-2 rounded bg-gray-800" required />
        ) : (
          <input type="file" accept="image/*" ref={fileInput} onChange={e => setImage(e.target.files?.[0] || null)} className="p-2 rounded bg-gray-800" required />
        )}
        <button type="submit" disabled={uploading} className="bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500">
          {uploading ? "Uploading..." : "Upload Slide"}
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {slides.map(slide => (
          <div key={slide.id} className="bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
            <img src={slide.image} alt={slide.title} className="w-full h-40 object-cover rounded mb-2 border-2 border-yellow-400" />
            <h2 className="text-lg font-bold mb-1 text-yellow-300">{slide.title}</h2>
            {slide.link && <a href={slide.link} target="_blank" rel="noopener" className="text-blue-400 underline mb-2">Visit Link</a>}
            <button onClick={() => handleDelete(slide.id, slide.image)} className="mt-2 text-red-400 hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
