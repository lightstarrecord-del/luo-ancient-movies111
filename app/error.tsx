"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Something went wrong</h1>
        <p className="mb-4 text-gray-700">{error.message || "An unexpected error occurred. Please try again."}</p>
        <button
          onClick={() => reset()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
