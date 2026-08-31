import { useEffect, useState } from "react";
import {
  House,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import AIAssistant from "./AIAssistant";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navLinks = [
    { name: "Home", url: "/" },
    { name: "How It Works", url: createPageUrl("HowItWorks") },
    { name: "Blueprint", url: createPageUrl("BlueprintGenerator") },
    { name: "Interior", url: createPageUrl("InteriorDesign") },
    { name: "Exterior", url: createPageUrl("ExteriorDesign") },
    { name: "Compound", url: createPageUrl("CompoundDesign") },
    { name: "Cost Estimator", url: createPageUrl("Materials") },
    { name: "Contractors", url: createPageUrl("Contractors") },
    { name: "My Designs", url: createPageUrl("DesignLibrary") },
  ];

  const isActive = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[length:var(--font-body)] leading-[1.618]">
      <style>{`
        :root {
          --obsidian: #1a1a1a;
          --shell: #FAF8F5;
          --gold: #B8860B;
          --gold-light: #D4A84B;
          --font-h1: clamp(2.5rem, 5vw, 4rem);
          --font-h2: clamp(1.75rem, 3.5vw, 2.75rem);
          --font-body: clamp(1rem, 1.6vw, 1.125rem);
        }



        * { box-sizing: border-box; }

        body {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans  { font-family: 'Inter', sans-serif; }

        .glass-nav {
          backdrop-filter: blur(20px);
          background: rgba(250, 248, 245, 0.95);
          border-bottom: 1px solid rgba(184, 134, 11, 0.1);
        }

        .nav-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

        .glow-text { text-shadow: 0 0 20px rgba(184, 134, 11, 0.3); }
        .text-shadow-dark { text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5); }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ─── Navigation ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-transition ${
          scrolled || mobileOpen ? "glass-nav py-3" : "bg-transparent py-5"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group transform transition-transform hover:scale-105"
              aria-label="GRUHAM home"
            >
              <House
                className={`w-8 h-8 ${scrolled || mobileOpen ? "text-[#B8860B]" : "text-white text-shadow-dark"}`}
              />
              <div>
                <p className="text-[#B8860B] text-lg font-bold font-serif glow-text leading-none">
                  GRUHAM
                </p>
                <p
                  className={`text-[10px] tracking-widest leading-none mt-0.5 ${
                    scrolled || mobileOpen ? "text-[#B8860B]" : "text-[#B8860B] text-shadow-dark"
                  }`}
                >
                  Plot to home, planned right.
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.slice(0, 7).map((link) => (
                <Link
                  key={link.name}
                  to={link.url}
                  className={`text-sm font-medium transition-all duration-300 hover:text-[#B8860B] relative group ${
                    isActive(link.url)
                      ? "text-[#B8860B]"
                      : scrolled || mobileOpen
                      ? "text-[#1a1a1a]"
                      : "text-white text-shadow-dark"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#B8860B] transition-all duration-300 ${
                      isActive(link.url) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to={createPageUrl("DesignLibrary")}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-[#1a1a1a]" : "text-white text-shadow-dark"
                } hover:text-[#B8860B]`}
              >
                My Designs
              </Link>
              <Link
                to={createPageUrl("BlueprintGenerator")}
                className="bg-[#B8860B] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Free
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 z-50 rounded-lg transition-colors ${
                scrolled || mobileOpen ? "text-[#1a1a1a]" : "text-white text-shadow-dark"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#FAF8F5]/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col items-center gap-7 w-full px-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.url}
                onClick={() => setMobileOpen(false)}
                className={`text-xl font-medium transition-all duration-300 hover:text-[#B8860B] ${
                  isActive(link.url) ? "text-[#B8860B]" : "text-[#1a1a1a]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={createPageUrl("BlueprintGenerator")}
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-[#B8860B] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#1a1a1a] transition-all duration-300"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}

      {/* ─── Page content ─── */}
      <main className="relative">{children}</main>

      {/* AI Assistant */}
      <AIAssistant />

      {/* ─── Footer ─── */}
      <footer className="bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">

            {/* Brand col */}
            <div className="lg:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-4">
                <House className="w-7 h-7 text-[#B8860B]" />
                <div>
                  <p className="font-serif text-xl font-bold glow-text leading-none">GRUHAM</p>
                  <p className="text-[10px] text-[#B8860B] tracking-widest mt-0.5">
                    Plot to home, planned right.
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-300 mb-5 max-w-xs">
                AI-assisted home design and cost planning for Indian homeowners.
                Concept plans, itemised estimates, and verified contractors — all in one place.
              </p>
              {/* Contact via email */}
              <div className="flex gap-3">
                <a
                  href="mailto:hello@gruhamapp.com"
                  aria-label="Email GRUHAM"
                  className="w-9 h-9 bg-[#B8860B] rounded-full flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product col */}
            <div>
              <h3 className="font-serif text-base font-semibold mb-5 text-[#B8860B]">Product</h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["Blueprint Generator", "BlueprintGenerator"],
                  ["Interior Design", "InteriorDesign"],
                  ["Exterior Design", "ExteriorDesign"],
                  ["Compound Design", "CompoundDesign"],
                  ["Cost Estimator", "Materials"],
                  ["Design Gallery", "Gallery"],
                ].map(([label, page]) => (
                  <li key={page}>
                    <Link
                      to={createPageUrl(page)}
                      className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Contractors col */}
            <div>
              <h3 className="font-serif text-base font-semibold mb-5 text-[#B8860B]">
                For Contractors
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["Find Contractors", "Contractors"],
                  ["Register as Contractor", "ContractorRegister"],
                  ["Pricing Plans", "Pricing"],
                  ["My Designs", "DesignLibrary"],
                ].map(([label, page]) => (
                  <li key={page}>
                    <Link
                      to={createPageUrl(page)}
                      className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="font-serif text-base font-semibold mt-7 mb-4 text-[#B8860B]">
                Company
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["How It Works", "HowItWorks"],
                  ["About", "About"],
                  ["Contact", "Contact"],
                ].map(([label, page]) => (
                  <li key={page}>
                    <Link
                      to={createPageUrl(page)}
                      className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact col */}
            <div>
              <h3 className="font-serif text-base font-semibold mb-5 text-[#B8860B]">
                Get In Touch
              </h3>
              <address className="space-y-4 text-sm flex flex-col items-center md:items-start not-italic">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#B8860B]" />
                  <a
                    href="mailto:hello@gruhamapp.com"
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    hello@gruhamapp.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B8860B] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">India</span>
                </div>
              </address>

              <h3 className="font-serif text-base font-semibold mt-7 mb-4 text-[#B8860B]">
                Legal
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to={createPageUrl("Legal")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Legal")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Legal") + "#ai-disclaimer"}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    AI Disclaimer
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Legal") + "#refunds"}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer strip */}
          <div className="mt-10 pt-8 border-t border-gray-800 space-y-3">
            <p className="text-xs text-gray-500 max-w-4xl">
              ⚠️ <strong className="text-gray-400">AI output is concept-only</strong> — all designs,
              floor plans, and renders generated by GRUHAM are illustrations for planning purposes and
              are not architectural or structural drawings intended for construction. Always engage a
              licensed architect before building.
            </p>
            <p className="text-xs text-gray-500 max-w-4xl">
              💰 <strong className="text-gray-400">Cost estimates are indicative (±15%)</strong> —
              based on current market rate inputs for your city and finish level. Not a contractor
              quotation. Rates last updated: August 2026.
            </p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 GRUHAM. All rights reserved. Built in India 🇮🇳</p>
            <div className="flex gap-5 text-sm">
              <Link to={createPageUrl("Legal")} className="text-gray-500 hover:text-[#B8860B] transition-colors">
                Privacy
              </Link>
              <Link to={createPageUrl("Legal")} className="text-gray-500 hover:text-[#B8860B] transition-colors">
                Terms
              </Link>
              <Link to={createPageUrl("Legal") + "#ai-disclaimer"} className="text-gray-500 hover:text-[#B8860B] transition-colors">
                AI Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
