"use client";
import React from "react";

function getGoogleDriveId(src: string) {
  const match = src.match(/drive\.google\.com\/file\/d\/([\w-]+)\/view/);
  return match ? match[1] : null;
}

export default function Player({ src }: { src: string }) {
  const driveId = getGoogleDriveId(src);
  return (
    <div className="w-full my-4">
      {driveId ? (
        <div className="w-full" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0 bg-black"
            title="Google Drive Video Player"
            style={{ minHeight: 200, maxHeight: '90vh' }}
          />
        </div>
      ) : src ? (
        <div className="w-full" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <video
            src={src}
            controls
            className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            preload="metadata"
            style={{ minHeight: 200, maxHeight: '90vh' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="text-gray-400">No video available</div>
      )}
    </div>
  );
}
