
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
  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {adverts.map((ad) => (
            <Link key={ad.id} href={`/advert/${ad.id}`} className="group">
              <div className="bg-gray-900 rounded-lg shadow hover:shadow-lg transition flex flex-col cursor-pointer">
                {/* Fixed 16:9 aspect ratio for poster */}
                <div className="relative w-full aspect-w-16 aspect-h-9 bg-gray-800 rounded-t-lg overflow-hidden">
                  {ad.videoLink ? (
                    <video src={ad.videoLink} className="absolute inset-0 w-full h-full object-cover" controls={false} preload="metadata" poster={ad.image || undefined} />
                  ) : (
                    <img src={ad.image || '/placeholder.jpg'} alt={ad.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {ad.videoLink && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 rounded-full p-2">
                        <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h2 className="text-base font-bold mb-1 text-yellow-300 group-hover:text-yellow-400 line-clamp-2">{ad.title}</h2>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{ad.description}</p>
                  <span className="text-xs text-gray-500 mt-auto">{ad.link && <span>Read more...</span>}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
