import { useEffect, useState } from "react";
import {
  House,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Twitter,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import AIAssistant from "./AIAssistant";

export default function Layout({ children: e, currentPageName: t }) {
  const n = useLocation(),
    [r, o] = useState(false),
    [l, c] = useState(false);
  useEffect(() => {
    const h = () => {
      o(window.scrollY > 80);
    };
    return (
      window.addEventListener("scroll", h, {
        passive: true,
      }),
      () => window.removeEventListener("scroll", h)
    );
  }, []);
  const d = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Blueprint",
      url: createPageUrl("BlueprintGenerator"),
    },
    {
      name: "Interior",
      url: createPageUrl("InteriorDesign"),
    },
    {
      name: "Exterior",
      url: createPageUrl("ExteriorDesign"),
    },
    {
      name: "Compound",
      url: createPageUrl("CompoundDesign"),
    },
    {
      name: "Materials",
      url: createPageUrl("Materials"),
    },
    {
      name: "Contractors",
      url: createPageUrl("Contractors"),
    },
    {
      name: "My Designs",
      url: createPageUrl("DesignLibrary"),
    },
    {
      name: "Join as Contractor",
      url: createPageUrl("ContractorRegister"),
    },
  ];
  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[length:var(--font-body)] leading-[1.618]">
      <style>
        {`
        :root {
          --obsidian: #1a1a1a;
          --shell: #FAF8F5;
          --gold: #B8860B;
          --gold-light: #D4A84B;
          --font-h1: clamp(2.5rem, 5vw, 4rem);
          --font-h2: clamp(1.75rem, 3.5vw, 2.75rem);
          --font-body: clamp(1rem, 1.6vw, 1.125rem);
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .glass-nav {
          backdrop-filter: blur(20px);
          background: rgba(250, 248, 245, 0.95);
          border-bottom: 1px solid rgba(184, 134, 11, 0.1);
        }
        
        .nav-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(184, 134, 11, 0.3);
        }

        .text-shadow-dark {
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}
      </style>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-transition ${r || l ? "glass-nav py-3" : "bg-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 group transform transition-transform hover:scale-105"
            >
              <div className="relative">
                <House
                  className={`w-8 h-8 ${r || l ? "text-[#B8860B]" : "text-white text-shadow-dark"}`}
                />
              </div>
              <div>
                <h1 className="text-[#B8860B] text-lg font-bold font-serif glow-text">GRUHAM</h1>
                <p
                  className={`text-xs tracking-widest ${r || l ? "text-[#B8860B]" : "text-[#B8860B] text-shadow-dark"}`}
                >
                  App
                </p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              {d.map((h) => (
                <Link
                  key={h.name}
                  to={h.url}
                  className={`text-sm font-medium transition-all duration-300 hover:text-[#B8860B] relative group ${n.pathname === h.url ? "text-[#B8860B]" : r || l ? "text-[#1a1a1a]" : "text-white text-shadow-dark"}`}
                >
                  {h.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B8860B] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
            <div className="hidden lg:block">
              <Link
                to={createPageUrl("BlueprintGenerator")}
                className="bg-[#B8860B] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Designing
              </Link>
            </div>
            <button
              className={`lg:hidden p-2 z-50 ${r || l ? "text-[#1a1a1a]" : "text-white text-shadow-dark"}`}
              onClick={() => c(!l)}
            >
              {l ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      {l && (
        <div className="fixed inset-0 bg-[#FAF8F5]/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center lg:hidden">
          <div className="flex flex-col items-center gap-8">
            {d.map((h) => (
              <Link
                key={h.name}
                to={h.url}
                onClick={() => c(false)}
                className={`text-2xl font-medium transition-all duration-300 hover:text-[#B8860B] ${n.pathname === h.url ? "text-[#B8860B]" : "text-[#1a1a1a]"}`}
              >
                {h.name}
              </Link>
            ))}
            <Link
              to={createPageUrl("BlueprintGenerator")}
              onClick={() => c(false)}
              className="mt-8 bg-[#B8860B] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#1a1a1a] transition-all duration-300"
            >
              Start Designing
            </Link>
          </div>
        </div>
      )}
      <main className="relative">{e}</main>
      <AIAssistant />
      <footer className="bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
            <div className="lg:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-6">
                <House className="w-8 h-8 text-[#B8860B]" />
                <div>
                  <h2 className="font-serif text-2xl font-bold glow-text">GRUHAM</h2>
                  <p className="text-xs text-[#B8860B] tracking-widest">App</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-300 mb-6">
                Transform your living spaces with AI-powered interior design visualization. See your
                dream home before you build it.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-[#B8860B] rounded-full flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#B8860B] rounded-full flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#B8860B] rounded-full flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-6 text-[#B8860B]">Design Tools</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to={createPageUrl("BlueprintGenerator")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Blueprint Generator
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("InteriorDesign")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Interior Design
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("ExteriorDesign")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Exterior Design
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("CompoundDesign")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Compound Design
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Materials")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Materials & Costs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-6 text-[#B8860B]">Services</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to={createPageUrl("Contractors")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Find Contractors
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("DesignLibrary")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    My Designs
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Gallery")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Design Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Pricing")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Contact")}
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-6 text-[#B8860B]">Get In Touch</h3>
              <address className="space-y-4 text-sm flex flex-col items-center md:items-start not-italic">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#B8860B]" />
                  <a
                    href="mailto:hello@gruhamapp.com"
                    className="text-gray-300 hover:text-[#B8860B] transition-colors duration-300"
                  >
                    hello@gruhamapp.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B8860B] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2024 Gruham App. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-[#B8860B] transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#B8860B] transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
