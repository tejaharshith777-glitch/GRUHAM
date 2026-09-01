import { useState } from "react";
import {
  Briefcase,
  Building2,
  Camera,
  CircleCheckBig,
  LoaderCircle,
  MapPin,
  Plus,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const specializations = [
  "Civil Construction",
  "Interior Design",
  "Exterior Design",
  "Architecture",
  "Electrical Work",
  "Plumbing",
  "Painting",
  "Flooring",
  "Roofing",
  "Landscaping",
  "Modular Kitchen",
  "Woodwork & Carpentry",
  "False Ceiling",
  "HVAC",
  "Waterproofing",
];
const registerCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
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
const budgetTiers = [
  {
    id: "budget",
    label: "Budget (₹800-1200/sqft)",
  },
  {
    id: "moderate",
    label: "Moderate (₹1200-1800/sqft)",
  },
  {
    id: "premium",
    label: "Premium (₹1800-2500/sqft)",
  },
  {
    id: "luxury",
    label: "Luxury (₹2500+/sqft)",
  },
];
export default function ContractorRegister() {
  const [e, t] = useState({
      name: "",
      phone: "",
      email: "",
      city: "",
      area: "",
      bio: "",
      specializations: [],
      experience_years: "",
      completed_projects: "",
      price_range: "",
      portfolio: [],
    }),
    [n, r] = useState(false),
    [o, l] = useState(false),
    [c, d] = useState(false),
    [h, p] = useState(null),
    m = (N) => {
      t((w) => ({
        ...w,
        specializations: w.specializations.includes(N)
          ? w.specializations.filter((C) => C !== N)
          : [...w.specializations, N],
      }));
    },
    y = async (N) => {
      const w = N.target.files[0];
      if (w) {
        d(true);
        try {
          const { file_url: C } = await base44.integrations.Core.UploadFile({
            file: w,
          });
          p(C);
        } catch (C) {
          console.error("Upload error:", C);
        }
        d(false);
      }
    },
    x = async (N) => {
      const w = Array.from(N.target.files);
      if (w.length !== 0) {
        d(true);
        try {
          const C = w.map(async (T) => {
              const { file_url: P } = await base44.integrations.Core.UploadFile({
                file: T,
              });
              return {
                image_url: P,
                title: "",
                description: "",
                tags: [],
              };
            }),
            E = await Promise.all(C);
          t((T) => ({
            ...T,
            portfolio: [...T.portfolio, ...E],
          }));
        } catch (C) {
          console.error("Upload error:", C);
        }
        d(false);
      }
    },
    j = (N, w, C) => {
      t((E) => ({
        ...E,
        portfolio: E.portfolio.map((T, P) =>
          P === N
            ? {
                ...T,
                [w]: C,
              }
            : T,
        ),
      }));
    },
    _ = (N) => {
      t((w) => ({
        ...w,
        portfolio: w.portfolio.filter((C, E) => E !== N),
      }));
    },
    [errorMsg, setErrorMsg] = useState(""),
    S = async (N) => {
      N.preventDefault();
      if (!e.name || !e.phone || !e.city || e.specializations.length === 0) {
        setErrorMsg("Please fill all required fields (Name, Phone, City, and at least one Specialization)");
        return;
      }
      setErrorMsg("");
      r(true);
      try {
        await new Promise((res) => setTimeout(res, 800));
        l(true);
      } catch (w) {
        console.error("Submit error:", w);
      }
      r(false);
    };
  return o ? (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-md"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CircleCheckBig className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">
          Thank you for your interest!
        </h2>
        <p className="text-gray-600 mb-2">
          We are building the verified marketplace.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Nothing is submitted and <strong>no profile is live yet</strong>.
          We will email you when contractor applications open. Thank you for your patience.
        </p>
        <Button onClick={() => (window.location.href = "/")} className="rounded-full bg-[#B8860B]">
          Go to Home
        </Button>
      </motion.div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
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
            <Briefcase className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">For Contractors</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#1a1a1a] mb-4">
            Join as a Contractor
          </h1>
          <p className="text-gray-600 text-lg">
            Register your profile to connect with homeowners looking for trusted contractors in your
            area
          </p>
        </motion.div>
        <motion.form
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
          onSubmit={S}
          className="space-y-6"
        >
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#B8860B]" />
              Profile Photo
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                {h ? (
                  <img src={h} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                {c && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <LoaderCircle className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <div className="bg-[#B8860B]/10 text-[#B8860B] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#B8860B]/20 transition-colors">
                  Upload Photo
                </div>
                <input type="file" accept="image/*" onChange={y} className="hidden" />
              </label>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#B8860B]" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name *</label>
                <Input
                  value={e.name}
                  onChange={(N) =>
                    t({
                      ...e,
                      name: N.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number *
                </label>
                <Input
                  value={e.phone}
                  onChange={(N) =>
                    t({
                      ...e,
                      phone: N.target.value,
                    })
                  }
                  placeholder="+91 XXXXX XXXXX"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                <Input
                  type="email"
                  value={e.email}
                  onChange={(N) =>
                    t({
                      ...e,
                      email: N.target.value,
                    })
                  }
                  placeholder="your@email.com"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  value={e.experience_years}
                  onChange={(N) =>
                    t({
                      ...e,
                      experience_years: N.target.value,
                    })
                  }
                  placeholder="E.g., 10"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#B8860B]" />
              Service Location
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">City *</label>
                <Select
                  value={e.city}
                  onValueChange={(N) =>
                    t({
                      ...e,
                      city: N,
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {registerCities.map((N) => (
                      <SelectItem key={N} value={N}>
                        {N}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Area/Locality
                </label>
                <Input
                  value={e.area}
                  onChange={(N) =>
                    t({
                      ...e,
                      area: N.target.value,
                    })
                  }
                  placeholder="E.g., Koramangala, Andheri West"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#B8860B]" />
              Specializations *
            </h3>
            <div className="flex flex-wrap gap-2">
              {specializations.map((N) => (
                <button
                  key={N}
                  type="button"
                  onClick={() => m(N)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${e.specializations.includes(N) ? "bg-[#B8860B] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {N}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4">Pricing & Projects</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                <Select
                  value={e.price_range}
                  onValueChange={(N) =>
                    t({
                      ...e,
                      price_range: N,
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetTiers.map((N) => (
                      <SelectItem key={N.id} value={N.id}>
                        {N.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Projects Completed
                </label>
                <Input
                  type="number"
                  value={e.completed_projects}
                  onChange={(N) =>
                    t({
                      ...e,
                      completed_projects: N.target.value,
                    })
                  }
                  placeholder="E.g., 50"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">About You</label>
              <Textarea
                value={e.bio}
                onChange={(N) =>
                  t({
                    ...e,
                    bio: N.target.value,
                  })
                }
                placeholder="Describe your experience, approach, and what makes you stand out..."
                className="h-24 rounded-xl"
              />
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#B8860B]" />
              Portfolio - Your Completed Projects
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {e.portfolio.map((N, w) => (
                <div key={w} className="relative group">
                  <img
                    src={N.image_url}
                    alt="Portfolio"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => _(w)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Input
                    value={N.title}
                    onChange={(C) => j(w, "title", C.target.value)}
                    placeholder="Project title"
                    className="mt-2 text-sm rounded-lg"
                  />
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#B8860B] transition-colors">
                {c ? (
                  <LoaderCircle className="w-8 h-8 text-[#B8860B] animate-spin" />
                ) : (
                  <>
                    <Plus className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">Add Photos</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple={true}
                  onChange={x}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Upload photos of your completed projects to showcase your work
            </p>
          </div>
          <Button
            type="submit"
            disabled={n}
            className="w-full h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] text-white rounded-full font-semibold text-lg"
          >
            {n ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
