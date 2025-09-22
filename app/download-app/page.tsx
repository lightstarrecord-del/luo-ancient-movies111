import Link from 'next/link'

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Download LUO ANCIENT MOVIES App</h1>
        <p className="text-gray-300 mb-4">Thank you for downloading. Click the button below to download the app package. Install on your device following the instructions.</p>
        <a href="/luo-ancient-app.zip" download className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-500">Download App (ZIP)</a>
        <div className="mt-4 text-sm text-gray-400">If you are on mobile, the file will download and you can open it with a file manager or follow installation instructions included in the ZIP.</div>
        <div className="mt-6">
          <Link href="/" className="text-blue-400 underline">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
