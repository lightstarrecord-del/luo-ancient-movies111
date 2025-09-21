export function WelcomeBanner() {
  return (
    <div className="bg-black py-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-red-900/20"></div>
      <div className="relative text-center">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black welcome-gradient-text tracking-wide">
          WELCOME TO LUO ANCIENT MOVIES
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm mt-1 font-light tracking-wide">
          Experience the Magic of Ancient Stories
        </p>
      </div>
    </div>
  )
}
