"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
      } else if (user.email !== "lightstarrecord@gmail.com") {
        router.push("/"); // Not admin, redirect to home
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard title="Manage Movies" description="Add, edit, or delete movies." href="/admin/movies" />
        <AdminCard title="Manage Series" description="Add, edit, or delete series." href="/admin/series" />
        <AdminCard title="Manage Episodes" description="Add, edit, or delete episodes." href="/admin/episodes" />
        <AdminCard title="Manage Users" description="View and manage users." href="/admin/users" />
        <AdminCard title="Manage Adverts" description="Add or remove adverts." href="/admin/adverts" />
        <AdminCard title="Upload Slide" description="Upload and manage slide header images for homepage carousel." href="/admin/slide-images" />
        <AdminCard title="Site Settings" description="Update site settings and content." href="/admin/settings" />
      </div>
    </div>
  );
}

function AdminCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a href={href} className="block bg-gray-900 rounded-lg shadow p-6 hover:bg-yellow-400 hover:text-black transition-colors">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-2">{description}</p>
      <span className="text-sm font-semibold underline">Go to {title}</span>
    </a>
  );
}
