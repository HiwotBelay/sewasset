export function Footer() {
  return (
    <footer className="bg-[#1A1F2E] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">SewAsset</h3>
            <p className="text-[#9CA3AF] text-sm">Intelligent ROI analysis for smarter investment decisions.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Features
                </a>
              </li>
              <li>
                <a href="#why" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="/calculator" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Calculator
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9CA3AF] hover:text-white transition-smooth">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#374151] pt-8">
          <p className="text-[#D1D5DB] text-center">&copy; 2025 SewAsset. All rights reserved.</p>
          <p className="text-sm text-[#9CA3AF] text-center mt-2">Empowering businesses with intelligent ROI analysis</p>
        </div>
      </div>
    </footer>
  )
}
