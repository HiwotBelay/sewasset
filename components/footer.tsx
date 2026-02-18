export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1A1F2E] to-[#0F1419] text-white py-12 sm:py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FDC700]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B5998]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="animate-fade-in-up">
            <h3 className="font-bold text-white mb-4 text-lg">SewAsset</h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">Intelligent ROI analysis for smarter investment decisions.</p>
          </div>
          <div className="animate-fade-in-up delay-200">
            <h4 className="font-semibold text-white mb-5 text-base">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#features" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Features
                </a>
              </li>
              <li>
                <a href="#why" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="/calculator" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Calculator
                </a>
              </li>
            </ul>
          </div>
          <div className="animate-fade-in-up delay-300">
            <h4 className="font-semibold text-white mb-5 text-base">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="animate-fade-in-up delay-500">
            <h4 className="font-semibold text-white mb-5 text-base">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-[#FDC700] transition-extra-smooth inline-block hover:translate-x-1">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#374151]/50 pt-8 animate-fade-in-up delay-700">
          <p className="text-[#D1D5DB] text-center text-sm mb-2">&copy; 2025 SewAsset. All rights reserved.</p>
          <p className="text-xs text-[#9CA3AF] text-center">Empowering businesses with intelligent ROI analysis</p>
        </div>
      </div>
    </footer>
  )
}
