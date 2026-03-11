"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-auto">
              <Image
                src="/sewassetlogo.png"
                alt="SewAsset Logo"
                width={120}
                height={48}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#why"
              className="text-[#6B7280] hover:text-[#2E4059] transition-smooth"
            >
              Why Use?
            </Link>
            <Link
              href="#features"
              className="text-[#6B7280] hover:text-[#2E4059] transition-smooth"
            >
              Features
            </Link>
            <Link
              href="/disclaimer"
              className="px-6 py-2 bg-[#FDC700] text-[#2E4059] font-semibold rounded-lg hover:bg-[#F5AF19] transition-smooth"
            >
              Start Calculating
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X size={24} className="text-[#2E4059]" />
            ) : (
              <Menu size={24} className="text-[#2E4059]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="#why"
              className="block px-4 py-2 text-[#6B7280] hover:text-[#2E4059]"
            >
              Why Use?
            </Link>
            <Link
              href="#features"
              className="block px-4 py-2 text-[#6B7280] hover:text-[#2E4059]"
            >
              Features
            </Link>
            <Link
              href="/disclaimer"
              className="block px-4 py-2 bg-[#FDC700] text-[#2E4059] font-semibold rounded-lg text-center"
            >
              Start Calculating
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
