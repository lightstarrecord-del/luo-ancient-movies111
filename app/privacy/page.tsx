import { Navbar } from "@/components/navbar"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">
            This Privacy Policy describes how MovieBox collects, uses, and protects your information when you use our
            service.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
          <p className="text-gray-300 mb-4">
            We collect information you provide directly to us, such as when you create an account, use our services, or
            contact us.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">
            We use the information we collect to provide, maintain, and improve our services, process transactions, and
            communicate with you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information Sharing</h2>
          <p className="text-gray-300 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your
            consent, except as described in this policy.
          </p>
        </div>
      </div>
    </div>
  )
}
