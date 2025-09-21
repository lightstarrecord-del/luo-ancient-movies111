import { Navbar } from "@/components/navbar"

export default function UserAgreementPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">User Agreement</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">
            By using MovieBox, you agree to be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-300 mb-4">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this
            agreement.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Use License</h2>
          <p className="text-gray-300 mb-4">
            Permission is granted to temporarily download one copy of the materials on MovieBox for personal,
            non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Disclaimer</h2>
          <p className="text-gray-300 mb-4">
            The materials on MovieBox are provided on an 'as is' basis. MovieBox makes no warranties, expressed or
            implied.
          </p>
        </div>
      </div>
    </div>
  )
}
