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
  useEffect(() => {
    if (!id) return;
    const likeRef = ref(db, `stats/${id}/like`);
    const rateRef = ref(db, `stats/${id}/rate`);
    const unsubLike = onValue(likeRef, (snap) => setLike(snap.val() || 0));
    const unsubRate = onValue(rateRef, (snap) => setRate(snap.val() || 0));
    return () => { unsubLike(); unsubRate(); };
  }, [id]);

  const handleLike = () => {
    const likeRef = ref(db, `stats/${id}/like`);
    runTransaction(likeRef, (curr) => (curr || 0) + 1);
  };
  const handleRate = () => {
    const rateRef = ref(db, `stats/${id}/rate`);
    runTransaction(rateRef, (curr) => (curr || 0) + 1);
  };
  const handleDownload = () => {
    const downloadRef = ref(db, `stats/${id}/download`);
    runTransaction(downloadRef, (curr) => (curr || 0) + 1);
  };
  const [isSeries, setIsSeries] = useState(false);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const currentSrc = selectedEpisode ? selectedEpisode.playLink : item?.playLink;

  // Reset selected episode when switching to a different item
  useEffect(() => {
    setSelectedEpisode(null);
  }, [id]);

  // When episodes load for a series, auto-select Episode 1 (best-effort)
  useEffect(() => {
    if (!isSeries) return;
    if (!episodes || episodes.length === 0) return;
    if (selectedEpisode) return; // don't override manual selection

    // Try common fields for episode number
    const byNumeric = episodes.find((e) => e && (e.episodeNumber === 1 || e.episode === 1 || e.ep === 1));
    if (byNumeric) {
      setSelectedEpisode(byNumeric);
      return;
    }

    // Try to find Episode 1 by title heuristics
    const byTitle = episodes.find((e) => e && e.title && /episode\s*1|ep\.?\s*1|e\s*1/i.test(e.title));
    if (byTitle) {
      setSelectedEpisode(byTitle);
      return;
    }

    // Fallback to the first episode in the array
    setSelectedEpisode(episodes[0]);
  }, [isSeries, episodes, selectedEpisode]);

  useEffect(() => {
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
        
        <div className="flex-1 min-w-0">
          <div id="series-player">{currentSrc && <Player src={currentSrc} />}</div>
          
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
          
          <div className="mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-2 text-yellow-300">Comments</h3>
            <textarea className="w-full p-2 rounded bg-gray-900 text-white border border-yellow-400 mb-2" placeholder="Add a comment..." rows={2} disabled />
            <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold opacity-60 cursor-not-allowed" disabled>Post (coming soon)</button>
          </div>
          
          {isSeries && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-yellow-300">Episodes</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {episodes.map((ep, idx) => {
                  const num = ep.episodeNumber || ep.episode || ep.ep || (idx + 1);
                  return (
                    <div key={ep.id} className="relative bg-gray-800 rounded overflow-hidden cursor-pointer" onClick={() => setSelectedEpisode(ep)}>
                      <img src={ep.image || item.image} alt={ep.title} className="w-full h-20 object-cover" />
                      <div className="p-2">
                        <div className="text-xs text-white line-clamp-1">{ep.title}</div>
                      </div>
                      <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-semibold px-2 py-1 rounded">{num}</div>
                    </div>
                  )
                })}
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
