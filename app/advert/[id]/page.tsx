"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/realtime-db";
import { ref, onValue } from "firebase/database";

export default function AdvertReadMorePage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [ad, setAd] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    const adRef = ref(db, `adverts/${id}`);
    const unsub = onValue(adRef, (snap) => {
      setAd(snap.exists() ? { id, ...snap.val() } : null);
    });
    return () => unsub();
  }, [id]);

  if (!ad) return <div className="text-white p-8">Loading or not found...</div>;

  // Helper: detect YouTube ID
  const extractYouTubeId = (url: string) => {
    const m = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const isImage = (url: string) => /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(url);
  const isVideoFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

  // Look for first URL in description if present
  const findFirstUrl = (text: string) => {
    const m = text.match(/https?:\/\/[\w\-./?=&%#]+/i);
    return m ? m[0] : null;
  };

  const embeddedUrl = ad.description ? findFirstUrl(ad.description) : null;
  const youtubeId = embeddedUrl ? extractYouTubeId(embeddedUrl) : null;

  return (
    <article className="min-h-screen bg-black text-white px-4 py-8 flex flex-col items-center">
      {/* Primary media: prefer explicit videoLink, then embedded link, then image */}
      {ad.videoLink ? (
        <video src={ad.videoLink} controls poster={ad.image || undefined} className="w-full max-w-3xl mb-6 rounded shadow bg-black" />
      ) : youtubeId ? (
        <div className="w-full max-w-3xl mb-6 rounded shadow overflow-hidden">
          <iframe className="w-full h-64 md:h-96" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video" allowFullScreen></iframe>
        </div>
      ) : embeddedUrl && isVideoFile(embeddedUrl) ? (
        <video src={embeddedUrl} controls poster={ad.image || undefined} className="w-full max-w-3xl mb-6 rounded shadow bg-black" />
      ) : embeddedUrl && isImage(embeddedUrl) ? (
        <img src={embeddedUrl} alt={ad.title} className="w-full max-w-3xl mb-6 rounded shadow object-contain bg-black" />
      ) : ad.image ? (
        <img src={ad.image} alt={ad.title} className="w-full max-w-3xl mb-6 rounded shadow object-contain bg-black" />
      ) : null}

      <h1 className="text-3xl font-bold mb-4 text-yellow-400 text-center w-full max-w-3xl">{ad.title}</h1>

      <div className="mb-6 text-gray-300 whitespace-pre-line w-full max-w-3xl text-lg leading-relaxed">{ad.description}</div>

      {ad.link && (
        <a href={ad.link} target="_blank" rel="noopener" className="text-blue-400 underline mb-2 inline-block text-lg max-w-3xl">Visit Link</a>
      )}
    </article>
  );
}
