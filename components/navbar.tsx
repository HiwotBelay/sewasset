"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
      scrolled 
        ? "bg-white/98 backdrop-blur-xl shadow-xl border-b border-slate-200/60" 
        : "bg-white/80 backdrop-blur-lg border-b border-slate-200/40"
    }`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-[#FDC700]/5 via-transparent to-[#3B5998]/5 transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-50'
      }`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo with enhanced animation */}
          <Link 
            href="/" 
            className="flex items-center group relative"
          >
            <div className="relative h-12 w-auto transition-all duration-500 group-hover:scale-110 group-active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDC700]/20 to-[#3B5998]/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image
                src="/sewassetlogo.png"
                alt="SewAsset Logo"
                width={120}
                height={48}
                className="object-contain h-full w-auto relative z-10 transition-all duration-500"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu with enhanced animations */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="#why"
              className="text-[#6B7280] hover:text-[#2E4059] font-semibold transition-all duration-300 relative group py-2 px-1"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Why Use?
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 text-[#FDC700]" />
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FDC700] to-[#F5AF19] group-hover:w-full transition-all duration-500 rounded-full"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#FDC700]/5 to-[#3B5998]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </Link>
            <Link
              href="#features"
              className="text-[#6B7280] hover:text-[#2E4059] font-semibold transition-all duration-300 relative group py-2 px-1"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Features
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 text-[#FDC700]" />
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FDC700] to-[#F5AF19] group-hover:w-full transition-all duration-500 rounded-full"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#FDC700]/5 to-[#3B5998]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </Link>
            <Link
              href="/disclaimer"
              className="px-6 py-2.5 bg-gradient-to-r from-[#FDC700] via-[#F5AF19] to-[#FDC700] text-[#2E4059] font-bold rounded-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Calculating
                <div className="w-2 h-2 bg-[#2E4059] rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></div>
              </span>
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5AF19] via-[#FDC700] to-[#F5AF19] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </Link>
          </div>

          {/* Mobile Menu Button with enhanced animation */}
          <button 
            className="md:hidden p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 active:scale-95 transition-all duration-300 relative group" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className={`absolute inset-0 bg-gradient-to-r from-[#FDC700]/20 to-[#3B5998]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              {isOpen ? (
                <X size={24} className="text-[#2E4059] relative z-10 transition-all duration-300 rotate-0" />
              ) : (
                <Menu size={24} className="text-[#2E4059] relative z-10 transition-all duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-64 opacity-100 pb-4 mt-2" : "max-h-0 opacity-0"
        }`}>
          <div className="space-y-2 pt-4 border-t border-slate-200/50">
            <Link
              href="#why"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3.5 text-[#6B7280] hover:text-[#2E4059] hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300 font-semibold hover:translate-x-2 hover:shadow-md relative group"
            >
              <span className="flex items-center gap-2">
                Why Use?
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FDC700]" />
              </span>
            </Link>
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3.5 text-[#6B7280] hover:text-[#2E4059] hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300 font-semibold hover:translate-x-2 hover:shadow-md relative group"
            >
              <span className="flex items-center gap-2">
                Features
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FDC700]" />
              </span>
            </Link>
            <Link
              href="/disclaimer"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3.5 bg-gradient-to-r from-[#FDC700] to-[#F5AF19] text-[#2E4059] font-bold rounded-xl text-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Calculating</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5AF19] to-[#FDC700] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
