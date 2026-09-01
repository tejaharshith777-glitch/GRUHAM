import { useState } from "react";
import {
  Box,
  Download,
  Eye,
  FileText,
  Filter,
  Folder,
  Heart,
  LoaderCircle,
  Rotate3d,
  Search,
  Share2,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DesignLibrary() {
  const [e, t] = useState("all"),
    [n, r] = useState(""),
    [o, l] = useState(null),
    [c, d] = useState("2d"),
    [h, p] = useState(0),
    [toast, setToast] = useState(""),
    m = useQueryClient(),
    { data: y = [], isLoading: x } = useQuery({
      queryKey: ["savedDesigns"],
      queryFn: () => base44.entities.SavedDesign.list("-created_date"),
    }),
    j = useMutation({
      mutationFn: (w) => base44.entities.SavedDesign.delete(w),
      onSuccess: () =>
        m.invalidateQueries({
          queryKey: ["savedDesigns"],
        }),
    }),
    _ = useMutation({
      mutationFn: ({ id: w, isFavorite: C }) =>
        base44.entities.SavedDesign.update(w, {
          is_favorite: !C,
        }),
      onSuccess: () =>
        m.invalidateQueries({
          queryKey: ["savedDesigns"],
        }),
    }),
    S = y.filter((w) => {
      const C = e === "all" || w.design_type === e || (e === "favorites" && w.is_favorite),
        E =
          w.title?.toLowerCase().includes(n.toLowerCase()) ||
          w.style?.toLowerCase().includes(n.toLowerCase());
      return C && E;
    }),
    N = (w) =>
      ({
        full_house: "Full House",
        interior: "Interior",
        exterior: "Exterior",
        compound: "Compound",
        room: "Room",
      })[w] || w;
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#1a1a1a] text-[#B8860B] px-6 py-3 rounded-full shadow-2xl text-sm font-semibold border border-[#B8860B]">
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Folder className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Design Library</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Your Saved Designs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-2">
            Browse, view, and manage all your AI-generated blueprints and 3D visualizations
          </p>
          <p className="text-sm text-[#B8860B] bg-amber-50 rounded-full px-3 py-1 inline-block">
            Saved in this browser; cloud backup is next.
          </p>
        </motion.div>
        <div className="bg-white rounded-3xl p-4 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={n}
                onChange={(w) => r(w.target.value)}
                placeholder="Search designs..."
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <Select value={e} onValueChange={t}>
              <SelectTrigger className="w-48 h-12 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designs</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
                <SelectItem value="full_house">Full House</SelectItem>
                <SelectItem value="interior">Interior</SelectItem>
                <SelectItem value="exterior">Exterior</SelectItem>
                <SelectItem value="compound">Compound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {x ? (
          <div className="text-center py-20">
            <LoaderCircle className="w-12 h-12 text-[#B8860B] animate-spin mx-auto" />
          </div>
        ) : S.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">No designs yet</h3>
            <p className="text-gray-500">Start creating designs to build your library</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {S.map((w, C) => (
              <motion.div
                key={w.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: C * 0.05,
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group"
              >
                <div
                  className="relative aspect-[4/3] bg-gray-100 cursor-pointer"
                  onClick={() => l(w)}
                >
                  {w.visualization_url || w.blueprint_url ? (
                    <img
                      src={w.visualization_url || w.blueprint_url}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Box className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#B8860B] text-white text-xs px-2 py-1 rounded-full">
                      {N(w.design_type)}
                    </span>
                    {w.style && (
                      <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {w.style}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(E) => {
                      (E.stopPropagation(),
                        _.mutate({
                          id: w.id,
                          isFavorite: w.is_favorite,
                        }));
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart
                      className={`w-4 h-4 ${w.is_favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-1">{w.title}</h3>
                  <div className="flex gap-2 text-xs text-gray-500 mb-3">
                    {w.bhk && <span>{w.bhk}</span>}
                    {w.plot_size && (
                      <span>
                        •{w.plot_size}
                        sq ft
                      </span>
                    )}
                    {w.budget && <span>•{w.budget}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => l(w)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {(w.visualization_url || w.blueprint_url) && (
                      <a
                        href={w.visualization_url || w.blueprint_url}
                        download={true}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full rounded-full bg-[#B8860B]">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </a>
                    )}
                    <Button
                      onClick={() => j.mutate(w.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-red-500 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {o && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => l(null)}
        >
          <motion.div
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(w) => w.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">{o.title}</h2>
                <div className="flex gap-2">
                  {o.visualization_url && (
                    <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => d("2d")}
                        className={`px-3 py-1 rounded-full text-xs ${c === "2d" ? "bg-[#B8860B] text-white" : ""}`}
                      >
                        2D
                      </button>
                      <button
                        onClick={() => d("3d")}
                        className={`px-3 py-1 rounded-full text-xs ${c === "3d" ? "bg-[#B8860B] text-white" : ""}`}
                      >
                        3D
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {o.blueprint_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Blueprint
                    </h4>
                    <img src={o.blueprint_url} alt="Blueprint" className="w-full rounded-xl" />
                  </div>
                )}
                {o.visualization_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                      <Box className="w-4 h-4" />
                      3D Visualization
                    </h4>
                    {c === "2d" ? (
                      <img
                        src={o.visualization_url}
                        alt="Visualization"
                        className="w-full rounded-xl"
                      />
                    ) : (
                      <div className="relative">
                        <motion.img
                          src={o.visualization_url}
                          alt="3D View"
                          className="w-full rounded-xl"
                          style={{
                            transform: `rotateY(${h}deg)`,
                          }}
                          animate={{
                            rotateY: h,
                          }}
                        />
                        <div className="flex justify-center gap-4 mt-2">
                          <button
                            onClick={() => p((w) => w - 30)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                          >
                            <Rotate3d className="w-4 h-4 -scale-x-100" />
                          </button>
                          <button
                            onClick={() => p((w) => w + 30)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                          >
                            <Rotate3d className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {o.bhk && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Configuration</p>
                    <p className="font-bold">{o.bhk}</p>
                  </div>
                )}
                {o.style && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Style</p>
                    <p className="font-bold">{o.style}</p>
                  </div>
                )}
                {o.plot_size && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Plot Size</p>
                    <p className="font-bold">
                      {o.plot_size}
                      sq ft
                    </p>
                  </div>
                )}
                {o.budget && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-bold">{o.budget}</p>
                  </div>
                )}
              </div>
              {o.prompt && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-500 mb-1">Requirements</p>
                  <p className="text-sm text-gray-700">{o.prompt}</p>
                </div>
              )}
              {/* Before/After finish-level comparison (indicative) */}
              <div className="bg-[#FAF8F5] border border-[#B8860B]/20 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-[#B8860B] mb-2 uppercase tracking-wide">Finish Level Comparison (Indicative)</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1"><span className="text-gray-500">Standard:</span> <br/><span className="font-medium text-[#1a1a1a]">Base Cost</span></div>
                  <div className="flex-1 border-l pl-4"><span className="text-gray-500">Premium:</span> <br/><span className="font-medium text-[#1a1a1a]">+30%</span></div>
                  <div className="flex-1 border-l pl-4"><span className="text-gray-500">Luxury:</span> <br/><span className="font-medium text-[#1a1a1a]">+80%</span></div>
                </div>
              </div>
              <div className="flex gap-3">
                {(o.visualization_url || o.blueprint_url) && (
                  <a
                    href={o.visualization_url || o.blueprint_url}
                    download={true}
                    className="flex-1"
                  >
                    <Button className="w-full rounded-full bg-[#B8860B]">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-full"
                  onClick={() => {
                    const text = `GRUHAM Design: ${o.title}\nStyle: ${o.style || "N/A"}\nBudget: ${o.budget || "N/A"}`;
                    navigator.clipboard.writeText(text);
                    setToast("Summary copied to clipboard!");
                    setTimeout(() => setToast(""), 3000);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Copy Summary
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-full"
                  onClick={() => {
                    const url = window.location.origin + "?plan=" + o.id;
                    navigator.clipboard.writeText(url);
                    setToast("Shareable link copied!");
                    setTimeout(() => setToast(""), 3000);
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
                <Button variant="outline" onClick={() => l(null)} className="rounded-full">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
