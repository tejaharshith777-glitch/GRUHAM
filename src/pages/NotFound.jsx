import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { House } from "lucide-react";
import { createPageUrl } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#B8860B] font-medium tracking-[0.3em] text-sm mb-4">ERROR 404</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
          This page moved out
        </h1>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for does not exist. Head back home and keep designing.
        </p>
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 bg-[#B8860B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#D4A84B] transition-colors"
        >
          <House className="w-4 h-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
