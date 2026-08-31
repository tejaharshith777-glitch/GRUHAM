import { useState } from "react";
import {
  Building2,
  Camera,
  CircleCheckBig,
  Clock,
  Filter,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../lib/utils";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contractorCities = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
  "Indore",
  "Bhopal",
  "Nagpur",
  "Coimbatore",
  "Vizag",
  "Surat",
  "Vadodara",
  "Gurgaon",
  "Noida",
  "Thane",
  "Nashik",
  "Mysore",
];
const budgetSymbols = {
  budget: "₹",
  moderate: "₹₹",
  premium: "₹₹₹",
  luxury: "₹₹₹₹",
};
export default function Contractors() {
  const [e, t] = useState(""),
    [n, r] = useState("All Cities"),
    [o, l] = useState("rating"),
    [c, d] = useState(null),
    { data: h = [], isLoading: p } = useQuery({
      queryKey: ["contractors"],
      queryFn: () => base44.entities.Contractor.list("-rating"),
    }),
    m = h
      .filter((x) => {
        const j =
            x.name?.toLowerCase().includes(e.toLowerCase()) ||
            x.area?.toLowerCase().includes(e.toLowerCase()) ||
            x.specializations?.some((C) => C.toLowerCase().includes(e.toLowerCase())),
          _ = n === "All Cities" || x.city === n;
        return j && _;
      })
      .sort((x, j) =>
        o === "rating"
          ? (j.rating || 0) - (x.rating || 0)
          : o === "reviews"
            ? (j.total_reviews || 0) - (x.total_reviews || 0)
            : o === "experience"
              ? (j.experience_years || 0) - (x.experience_years || 0)
              : 0,
      );
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Building2 className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Find Contractors</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Trusted Contractors
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Find verified contractors in your area to bring your dream home to life. Connect
            directly and build with confidence.
          </p>
          <Link to={createPageUrl("ContractorRegister")}>
            <Button className="bg-[#1a1a1a] hover:bg-[#B8860B] text-white rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" />
              Register as Contractor
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="bg-white rounded-3xl p-6 shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={e}
                onChange={(x) => t(x.target.value)}
                placeholder="Search by name, area, or specialty..."
                className="h-12 pl-12 rounded-xl"
              />
            </div>
            <Select value={n} onValueChange={r}>
              <SelectTrigger className="h-12 rounded-xl">
                <MapPin className="w-4 h-4 mr-2 text-[#B8860B]" />
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {contractorCities.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={o} onValueChange={l}>
              <SelectTrigger className="h-12 rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-[#B8860B]" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing
            <span className="font-bold text-[#1a1a1a]">{m.length}</span>
            contractors
            {n !== "All Cities" && (
              <span>
                in
                <span className="text-[#B8860B] font-medium">{n}</span>
              </span>
            )}
          </p>
        </div>
        {p && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4">Loading contractors...</p>
          </div>
        )}
        {!p && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {m.map((x, j) => {
              return (
                <motion.div
                  key={x.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: j * 0.05,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
                  onClick={() => d(x)}
                >
                  <div className="relative p-6 pb-4">
                    <div className="flex items-start gap-4">
                      {x.profile_image ? (
                        <img
                          src={x.profile_image}
                          alt={x.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-[#B8860B]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-[#1a1a1a] group-hover:text-[#B8860B] transition-colors">
                            {x.name}
                          </h3>
                          {x.verified && <CircleCheckBig className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-[#B8860B]" />
                          <span className="text-sm text-gray-500">{x.area || x.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-[#B8860B] fill-current" />
                        <span className="font-bold text-[#1a1a1a]">{x.rating || "New"}</span>
                        {x.total_reviews > 0 && (
                          <span className="text-sm text-gray-400">
                            ({x.total_reviews}
                            reviews)
                          </span>
                        )}
                      </div>
                      {x.price_range && (
                        <span className="text-sm text-gray-400">
                          {budgetSymbols[x.price_range]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {x.specializations?.slice(0, 3).map((N, w) => (
                        <span
                          key={w}
                          className="bg-[#B8860B]/10 text-[#B8860B] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {N}
                        </span>
                      ))}
                      {x.specializations?.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{x.specializations.length - 3}
                          more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {x.experience_years || 0}+ years
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {x.completed_projects || 0}
                        Projects
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 flex gap-3">
                    <a
                      href={`tel:${x.phone}`}
                      onClick={(N) => N.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#B8860B] text-white py-3 rounded-xl hover:bg-[#1a1a1a] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                    <button
                      onClick={(N) => {
                        (N.stopPropagation(), d(x));
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#B8860B] text-[#B8860B] py-3 rounded-xl hover:bg-[#B8860B] hover:text-white transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        {!p && m.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="text-center py-16 bg-white rounded-3xl"
          >
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">
              No Contractors Found
            </h3>
            <p className="text-gray-500 mb-6">Be the first contractor in this area!</p>
            <Link to={createPageUrl("ContractorRegister")}>
              <Button className="bg-[#B8860B] hover:bg-[#1a1a1a] rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Register as Contractor
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {c && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => d(null)}
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(x) => x.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-end mb-4">
                  <button onClick={() => d(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-start gap-4 mb-6">
                  {c.profile_image ? (
                    <img
                      src={c.profile_image}
                      alt={c.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-[#B8860B]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">{c.name}</h2>
                      {c.verified && <CircleCheckBig className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-[#B8860B]" />
                      <span className="text-gray-500">
                        {c.area},{c.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-5 h-5 text-[#B8860B] fill-current" />
                      <span className="font-bold">{c.rating || "New"}</span>
                      {c.total_reviews > 0 && (
                        <span className="text-gray-400">
                          ({c.total_reviews}
                          reviews)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {c.bio && (
                  <div className="mb-6">
                    <h4 className="font-medium text-[#1a1a1a] mb-2">About</h4>
                    <p className="text-gray-600">{c.bio}</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#FAF8F5] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#B8860B]">{c.experience_years || 0}+</p>
                    <p className="text-sm text-gray-500">Years Exp.</p>
                  </div>
                  <div className="bg-[#FAF8F5] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#B8860B]">{c.completed_projects || 0}</p>
                    <p className="text-sm text-gray-500">Projects</p>
                  </div>
                  <div className="bg-[#FAF8F5] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#B8860B]">
                      {budgetSymbols[c.price_range] || "₹₹"}
                    </p>
                    <p className="text-sm text-gray-500">Price Range</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium text-[#1a1a1a] mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {c.specializations?.map((x, j) => (
                      <span
                        key={j}
                        className="bg-[#B8860B]/10 text-[#B8860B] px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
                {c.portfolio && c.portfolio.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-[#1a1a1a] mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#B8860B]" />
                      Portfolio
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {c.portfolio.map((x, j) => (
                        <div key={j} className="relative group">
                          <img
                            src={x.image_url}
                            alt={x.title || "Project"}
                            className="w-full h-24 object-cover rounded-xl"
                          />
                          {x.title && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                              <span className="text-white text-xs text-center px-2">{x.title}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <a
                    href={`tel:${c.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#B8860B] text-white py-4 rounded-xl font-semibold hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {c.phone}
                  </a>
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-[#B8860B] text-[#B8860B] py-4 rounded-xl font-semibold hover:bg-[#B8860B] hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
