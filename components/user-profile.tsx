"use client";

import { useEffect, useState } from "react";
import { getAuth, updateProfile, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { ref, set, getDatabase } from "firebase/database";


import { ChangeEvent } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setDisplayName(u?.displayName || "");
      setPhotoURL(u?.photoURL || "");
    });
    return () => unsubscribe();
  }, []);



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const auth = getAuth(app);
      if (!auth.currentUser) throw new Error("Not logged in");
      await updateProfile(auth.currentUser, { displayName, photoURL });
      // Save to Realtime DB as well
      const db = getDatabase(app);
      await set(ref(db, `users/${auth.currentUser.uid}`), {
        displayName,
        photoURL,
        email: auth.currentUser.email,
      });
      setSuccess("Profile updated!");
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  // Upload avatar file to Firebase Storage and update photoURL (preview + persisted URL)
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary local preview URL
    const previewUrl = URL.createObjectURL(file);
    setPhotoURL(previewUrl);

    try {
      const storage = getStorage();
      const storagePath = `avatars/${Date.now()}_${file.name}`;
      const imgRef = storageRef(storage, storagePath);
      await uploadBytes(imgRef, file);
      const downloadUrl = await getDownloadURL(imgRef);
      setPhotoURL(downloadUrl);
    } catch (err: any) {
      setError(err?.message || "Failed to upload avatar");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto bg-black text-white rounded shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Edit Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={photoURL || "/placeholder-user.jpg"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-yellow-400"
            onError={e => (e.currentTarget.src = "/placeholder-user.jpg")}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full p-2 border rounded bg-black text-white"
          />
          <input
            type="url"
            placeholder="Avatar Image URL"
            value={photoURL}
            onChange={e => setPhotoURL(e.target.value)}
            className="w-full p-2 border rounded bg-black text-white mt-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-yellow-400">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded bg-black text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold py-2 rounded"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {success && <div className="text-green-400 mt-2">{success}</div>}
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </form>
    </div>
  );
}
