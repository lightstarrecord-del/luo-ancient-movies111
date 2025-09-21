"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, deleteUser, updateProfile } from "firebase/auth";
import { db } from "@/lib/realtime-db";
import { ref, onValue, remove, update } from "firebase/database";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
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
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(Object.entries(data).map(([id, value]) => ({ id, ...(value as any) })));
      } else {
        setUsers([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    await remove(ref(db, `users/${id}`));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Manage Users</h1>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center bg-gray-800 rounded p-4">
              <img src={user.avatar || "/placeholder-user.jpg"} alt={user.name} className="w-12 h-12 object-cover rounded-full mr-4 border-2 border-yellow-400" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{user.name || user.email}</h2>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
              <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
