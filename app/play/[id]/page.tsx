"use client";
import { useEffect, useState } from "react";
import { useSubscriptionAccess } from "@/hooks/use-subscription-access";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/realtime-db";
import { ref, onValue, runTransaction, push } from "firebase/database";
import Player from "@/components/player";

export default function PlayPage() {
  const { status: subStatus } = useSubscriptionAccess();
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [item, setItem] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [like, setLike] = useState(0);
  const [rate, setRate] = useState(0);
  // Fetch like/rate from DB
  useEffect(() => {
    if (!id) return;
    const likeRef = ref(db, `stats/${id}/like`);
    const rateRef = ref(db, `stats/${id}/rate`);
    const unsubLike = onValue(likeRef, (snap) => setLike(snap.val() || 0));
    const unsubRate = onValue(rateRef, (snap) => setRate(snap.val() || 0));
    return () => { unsubLike(); unsubRate(); };
  }, [id]);

  // Record like
  const handleLike = () => {
    const likeRef = ref(db, `stats/${id}/like`);
    runTransaction(likeRef, (curr) => (curr || 0) + 1);
  };
  // Record rate
  const handleRate = () => {
    const rateRef = ref(db, `stats/${id}/rate`);
    runTransaction(rateRef, (curr) => (curr || 0) + 1);
  };
  // Record download
  const handleDownload = () => {
    const downloadRef = ref(db, `stats/${id}/download`);
    runTransaction(downloadRef, (curr) => (curr || 0) + 1);
  };
  const [isSeries, setIsSeries] = useState(false);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    // Try to fetch from movies, then series
    const movieRef = ref(db, `movies/${id}`);
    const unsubMovie = onValue(movieRef, (snap) => {
      if (snap.exists()) {
        setItem({ id, ...snap.val() });
        setIsSeries(false);
      } else {
        // Try series
        const seriesRef = ref(db, `series/${id}`);
        const unsubSeries = onValue(seriesRef, (snap2) => {
          if (snap2.exists()) {
            setItem({ id, ...snap2.val() });
            setIsSeries(true);
            // Fetch episodes for this series
            const episodesRef = ref(db, "episodes");
            onValue(episodesRef, (epSnap) => {
              const data = epSnap.val();
              if (data) {
                setEpisodes(Object.entries(data).filter(([_, v]: any) => v.seriesId === id).map(([eid, v]: any) => ({ id: eid, ...v })));
              } else {
                setEpisodes([]);
              }
            });
          } else {
            setItem(null);
          }
        });
        return () => unsubSeries();
      }
    });
    return () => unsubMovie();
  }, [id]);

  useEffect(() => {
    // Fetch related movies
    const moviesRef = ref(db, "movies");
    onValue(moviesRef, (snap) => {
      const data = snap.val();
      if (data && item) {
        setRelated(Object.entries(data).filter(([mid, v]: any) => mid !== id).slice(0, 6).map(([mid, v]: any) => ({ id: mid, ...v })));
      }
    });
  }, [item, id]);


  if (subStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Checking subscription...</div>;
  }
  if (subStatus === 'inactive') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Premium Required</h2>
          <p className="mb-6 text-gray-300">You need an active subscription to access this content.</p>
          <a href="/premium" className="bg-yellow-400 text-black font-bold px-6 py-2 rounded hover:bg-yellow-500">Go to Premium</a>
        </div>
      </div>
    );
  }
  if (!item) return <div className="text-white p-8">Loading or not found...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-2 md:p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Player left, Related right */}
        <div className="flex-1 min-w-0">
          {item.playLink && <Player src={item.playLink} />}
          {/* Action buttons below player */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {item.downloadLink && (
              <a
                href={item.downloadLink}
                target="_blank"
                rel="noopener"
                className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
                onClick={handleDownload}
              >
                Download
              </a>
            )}
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold" onClick={() => navigator.share ? navigator.share({ title: item.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href)}>Share</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold" onClick={handleLike}>Like ({like})</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded font-semibold" onClick={handleRate}>Rate ({rate})</button>
          </div>
          {/* Comment box */}
          <div className="mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-2 text-yellow-300">Comments</h3>
            <textarea className="w-full p-2 rounded bg-gray-900 text-white border border-yellow-400 mb-2" placeholder="Add a comment..." rows={2} disabled />
            <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold opacity-60 cursor-not-allowed" disabled>Post (coming soon)</button>
          </div>
          {/* Episodes for series */}
          {isSeries && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-yellow-300">Episodes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {episodes.map((ep) => (
                  <div key={ep.id} className="bg-gray-800 rounded p-2 flex flex-col items-center">
                    <img src={ep.image || item.image} alt={ep.title} className="w-24 h-24 object-cover rounded mb-2" />
                    <div className="font-semibold text-white text-center">{ep.title}</div>
                    <a href={ep.playLink} target="_blank" rel="noopener" className="mt-1 bg-yellow-400 text-black px-2 py-1 rounded text-xs">Play</a>
                    {ep.downloadLink && <a href={ep.downloadLink} target="_blank" rel="noopener" className="mt-1 bg-red-500 text-white px-2 py-1 rounded text-xs">Download</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Related movies right */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <h2 className="text-xl font-bold mb-4 text-yellow-300 text-center md:text-left">Related Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-4">
            {related.map((rel) => (
              <div key={rel.id} className="bg-gray-800 rounded p-2 flex flex-col items-center cursor-pointer hover:bg-yellow-400/10 transition" onClick={() => router.push(`/play/${rel.id}`)}>
                <img src={rel.image} alt={rel.title} className="w-24 h-36 object-cover rounded mb-2 border-2 border-yellow-400" />
                <div className="font-semibold text-white text-center line-clamp-2">{rel.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
