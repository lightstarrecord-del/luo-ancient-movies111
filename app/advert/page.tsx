
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/realtime-db";
import { ref, onValue } from "firebase/database";
import { HeroSection } from "@/components/hero-section";
import Link from "next/link";

export default function AdvertPage() {
  const [adverts, setAdverts] = useState<any[]>([]);
  useEffect(() => {
    const advertsRef = ref(db, "adverts");
    const unsub = onValue(advertsRef, (snap) => {
      const data = snap.val();
      if (data) setAdverts(Object.entries(data).map(([id, v]) => ({ id, ...(v as any) })));
      else setAdverts([]);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">Adverts</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {adverts.map((ad) => (
            <Link key={ad.id} href={`/advert/${ad.id}`} className="group block">
              <div className="bg-gray-900 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  {ad.videoLink ? (
                    <video src={ad.videoLink} className="absolute inset-0 w-full h-full object-cover" controls={false} preload="metadata" poster={ad.image || undefined} />
                  ) : (
                    <img src={ad.image || '/placeholder.jpg'} alt={ad.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {/* duration / play overlay */}
                  {ad.videoLink && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1">Play</div>
                  )}
                </div>
                <div className="p-3">
                  <h2 className="text-sm font-semibold mb-1 text-yellow-300 group-hover:text-yellow-400 line-clamp-2">{ad.title}</h2>
                  <p className="text-xs text-gray-400 mb-1 line-clamp-2">{ad.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{ad.link ? 'Read more' : ''}</span>
                    <span>{ad.views ? `${ad.views} views` : ''}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
