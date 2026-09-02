import { useState, useMemo, useEffect } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  PlusCircle,
  Search,
  Send,
  ShieldCheck,
  Star,
  UserCheck,
  UserCheck2,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";

const INITIAL_CONTRACTORS = [
  {
    id: "c_101",
    name: "Sharma & Sons Construction",
    city: "Mumbai",
    area: "Andheri West & Bandra",
    specialty: "Civil Construction",
    rating: 4.9,
    experience: 18,
    rateSqft: "₹1,850/sqft",
    verified: true,
    phone: "+91 98200 12345",
    email: "contact@sharmaconstructions.com",
    bio: "Full-service turnkey villa builder specializing in modern RCC frame structures, luxury basements, and premium finishes.",
    portfolio: [
      { title: "4BHK Modern Villa in Juhu", budget: "₹1.4 Cr", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=75&auto=format&fit=crop" },
      { title: "Duplex Residence in Bandra", budget: "₹95 Lakhs", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=75&auto=format&fit=crop" }
    ]
  },
  {
    id: "c_102",
    name: "Kumar Interior Studio",
    city: "Bengaluru",
    area: "Indiranagar & Whitefield",
    specialty: "Interior Design",
    rating: 4.8,
    experience: 12,
    rateSqft: "₹650/sqft",
    verified: true,
    phone: "+91 98450 67890",
    email: "info@kumarinteriors.in",
    bio: "Custom modular kitchens, wardrobe systems, and traditional Chettinad interior woodwork for apartments & independent homes.",
    portfolio: [
      { title: "Traditional Chettinad Living Room", budget: "₹28 Lakhs", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=75&auto=format&fit=crop" }
    ]
  },
  {
    id: "c_103",
    name: "Naidu Architectural Builders",
    city: "Hyderabad",
    area: "Gachibowli & Jubilee Hills",
    specialty: "Architecture",
    rating: 4.9,
    experience: 22,
    rateSqft: "₹2,200/sqft",
    verified: true,
    phone: "+91 99890 54321",
    email: "build@naiduarchitects.com",
    bio: "Architect-led construction team with in-house structural engineers, Vastu planners, and interior stylists.",
    portfolio: [
      { title: "Luxury Courtyard Bungalow", budget: "₹2.1 Cr", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=75&auto=format&fit=crop" }
    ]
  },
  {
    id: "c_104",
    name: "Iyer Heritage Builders",
    city: "Chennai",
    area: "Adyar & ECR",
    specialty: "Civil Construction",
    rating: 4.7,
    experience: 15,
    rateSqft: "₹1,650/sqft",
    verified: true,
    phone: "+91 94440 98765",
    email: "iyerbuilders@chennai.in",
    bio: "Specialists in Kerala vernacular & South Indian traditional home designs, red tile roofing, and sloped verandahs.",
    portfolio: [
      { title: "Kerala Style Beach House on ECR", budget: "₹88 Lakhs", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=75&auto=format&fit=crop" }
    ]
  },
];

export default function Contractors() {
  // User Mode Switcher: Customer View vs Contractor Dashboard View
  const [activePortal, setActivePortal] = useState("customer"); // "customer" | "contractor"
  
  // Customer Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Local Storage Persistent Contractors & Leads
  const [contractorsList, setContractorsList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [toast, setToast] = useState("");

  // Selected Modal States
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [inquiryModalContractor, setInquiryModalContractor] = useState(null);

  // Contractor Dashboard Profile & Add Project Form States
  const [myProfile, setMyProfile] = useState({
    name: "Apex Civil & Turnkey Builders",
    city: "Bengaluru",
    area: "HSR Layout & Koramangala",
    specialty: "Civil Construction",
    rating: 4.9,
    experience: 14,
    rateSqft: "₹1,750/sqft",
    phone: "+91 98800 99887",
    email: "builder@apexconstructions.in",
    bio: "Quality turnkey house builders with 14 years of residential construction expertise.",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    budget: "",
    image: "",
  });

  const [inquiryForm, setInquiryForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    message: "",
  });

  // Load persistent contractors & leads on mount
  useEffect(() => {
    const savedContractors = JSON.parse(localStorage.getItem("gruham_contractors") || "null");
    if (savedContractors && savedContractors.length > 0) {
      setContractorsList(savedContractors);
    } else {
      setContractorsList(INITIAL_CONTRACTORS);
      localStorage.setItem("gruham_contractors", JSON.stringify(INITIAL_CONTRACTORS));
    }

    const savedLeads = JSON.parse(localStorage.getItem("gruham_contractor_leads") || "[]");
    setLeadsList(savedLeads);
  }, []);

  // Customer Filtered Contractors List
  const filteredContractors = useMemo(() => {
    return contractorsList.filter((c) => {
      if (selectedCity !== "All" && c.city !== selectedCity) return false;
      if (selectedSpecialty !== "All" && c.specialty !== selectedSpecialty) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q);
      }
      return true;
    });
  }, [contractorsList, selectedCity, selectedSpecialty, searchQuery]);

  // Submit Inquiry to Contractor
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryModalContractor) return;

    const newLead = {
      id: "lead_" + Date.now(),
      contractorId: inquiryModalContractor.id,
      contractorName: inquiryModalContractor.name,
      customerName: inquiryForm.customerName,
      customerPhone: inquiryForm.customerPhone,
      customerEmail: inquiryForm.customerEmail,
      message: inquiryForm.message,
      status: "New Lead",
      date: new Date().toLocaleDateString("en-IN"),
    };

    const updatedLeads = [newLead, ...leadsList];
    setLeadsList(updatedLeads);
    localStorage.setItem("gruham_contractor_leads", JSON.stringify(updatedLeads));

    setInquiryModalContractor(null);
    setInquiryForm({ customerName: "", customerPhone: "", customerEmail: "", message: "" });
    setToast(`Inquiry sent to ${inquiryModalContractor.name}!`);
    setTimeout(() => setToast(""), 3500);
  };

  // Contractor Add New Portfolio Project
  const handleAddPortfolioProject = (e) => {
    e.preventDefault();
    if (!newProject.title) return;

    const sampleImages = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=75&auto=format&fit=crop"
    ];

    const projectObj = {
      title: newProject.title,
      budget: newProject.budget || "₹75 Lakhs",
      image: newProject.image || sampleImages[Math.floor(Math.random() * sampleImages.length)],
    };

    // Find contractor or create profile entry
    const myContractorEntry = {
      id: "c_my_profile",
      ...myProfile,
      verified: true,
      portfolio: [projectObj, ...(myProfile.portfolio || [])]
    };

    setMyProfile(myContractorEntry);

    const updatedList = [myContractorEntry, ...contractorsList.filter(c => c.id !== "c_my_profile")];
    setContractorsList(updatedList);
    localStorage.setItem("gruham_contractors", JSON.stringify(updatedList));

    setNewProject({ title: "", budget: "", image: "" });
    setToast("New portfolio project published to live customer directory!");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#1a1a1a] text-[#B8860B] px-6 py-3 rounded-full shadow-2xl text-sm font-semibold border border-[#B8860B]">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer variant="generator" />

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Users className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">Two-Sided Construction Platform</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            Contractors & Builders Portal
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with top verified Indian contractors or manage your contractor profile & customer leads.
          </p>
        </motion.div>

        {/* ROLE SWITCHER HEADER TABS */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-200 inline-flex gap-2">
            <button
              onClick={() => setActivePortal("customer")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activePortal === "customer"
                  ? "bg-[#B8860B] text-white shadow-md"
                  : "text-gray-600 hover:text-[#B8860B]"
              }`}
            >
              <Users className="w-4 h-4" />
              Customer Portal (Find Builders)
            </button>
            <button
              onClick={() => setActivePortal("contractor")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activePortal === "contractor"
                  ? "bg-[#1a1a1a] text-white shadow-md"
                  : "text-gray-600 hover:text-[#B8860B]"
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#B8860B]" />
              Contractor Portal (Post Projects & Leads)
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CUSTOMER PORTAL VIEW                                                */}
        {/* =================================================================== */}
        {activePortal === "customer" && (
          <div className="space-y-8">
            {/* Search & Filters */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
              <div className="grid md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-5 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contractor name, city, or specialty..."
                    className="pl-11 rounded-2xl h-12 border-gray-200"
                  />
                </div>
                <div className="md:col-span-3">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="rounded-2xl h-12 border-gray-200">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Cities</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4">
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="rounded-2xl h-12 border-gray-200">
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Specialties</SelectItem>
                      <SelectItem value="Civil Construction">Civil Construction</SelectItem>
                      <SelectItem value="Interior Design">Interior Design</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contractors Directory Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredContractors.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-4 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">{c.name}</h3>
                        {c.verified && (
                          <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100" title="Verified Contractor" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>{c.city} ({c.area})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-xs text-amber-900">{c.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{c.bio}</p>

                  <div className="grid grid-cols-3 gap-2 py-3 bg-gray-50 rounded-2xl text-center text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">EXPERIENCE</span>
                      <span className="font-bold text-gray-900">{c.experience} Yrs</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">SPECIALTY</span>
                      <span className="font-bold text-gray-900 truncate">{c.specialty}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">BASE RATE</span>
                      <span className="font-bold text-[#B8860B]">{c.rateSqft}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={() => setSelectedContractor(c)}
                      variant="outline"
                      className="flex-1 rounded-full border-gray-300 text-gray-800 text-xs font-bold h-11"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Portfolio ({c.portfolio?.length || 0})
                    </Button>
                    <Button
                      onClick={() => setInquiryModalContractor(c)}
                      className="flex-1 rounded-full bg-[#B8860B] hover:bg-[#997320] text-white text-xs font-bold h-11"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      Contact Builder
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* CONTRACTOR PORTAL VIEW (DASHBOARD & PORTFOLIO PUBLISHER)             */}
        {/* =================================================================== */}
        {activePortal === "contractor" && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Col: Profile & Add Portfolio Form (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Profile Details Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                    <UserCheck2 className="w-5 h-5 text-[#B8860B]" />
                    Contractor Profile Management
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Active Contractor Account
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block">Company Name</span>
                    <span className="font-bold text-gray-900 text-sm">{myProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Location</span>
                    <span className="font-bold text-gray-900 text-sm">{myProfile.city} ({myProfile.area})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Specialty</span>
                    <span className="font-bold text-gray-900">{myProfile.specialty}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Rate / Sqft</span>
                    <span className="font-bold text-[#B8860B]">{myProfile.rateSqft}</span>
                  </div>
                </div>
              </div>

              {/* Publish Portfolio Project Form */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#B8860B]" />
                  Publish New Portfolio Project
                </h3>
                <p className="text-xs text-gray-600">Post completed house projects so customers browsing the platform can view your work.</p>

                <form onSubmit={handleAddPortfolioProject} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Project Title</label>
                    <Input
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="E.g., 3BHK Modern Villa in Whitefield"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Project Cost / Budget</label>
                    <Input
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      placeholder="E.g., ₹85 Lakhs"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Image URL (Optional)</label>
                    <Input
                      value={newProject.image}
                      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-[#B8860B] hover:bg-[#997320] text-white rounded-full font-bold text-xs mt-2">
                    Publish Project to Live Customer Catalog
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Col: Customer Lead Inbox (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#B8860B]" />
                    Customer Lead Inbox ({leadsList.length})
                  </h3>
                </div>

                {leadsList.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-200">
                    <Mail className="w-10 h-10 mx-auto mb-2 opacity-50 text-gray-400" />
                    <p className="font-semibold text-sm">No lead inquiries yet</p>
                    <p className="text-xs text-gray-500 mt-1">Inquiries sent by customers through the directory will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leadsList.map((lead) => (
                      <div key={lead.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-sm">{lead.customerName}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          <strong>Phone:</strong> {lead.customerPhone} | <strong>Email:</strong> {lead.customerEmail}
                        </div>
                        <p className="text-gray-600 bg-white p-2.5 rounded-xl border border-amber-100 italic">
                          "{lead.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PORTFOLIO MODAL */}
      <AnimatePresence>
        {selectedContractor && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedContractor(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a]">{selectedContractor.name}</h3>
                <p className="text-xs text-[#B8860B] font-bold mt-0.5">{selectedContractor.specialty} • {selectedContractor.city}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm text-gray-800">Completed Projects Portfolio</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedContractor.portfolio?.map((p, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 text-xs">
                        <div className="font-bold text-gray-900">{p.title}</div>
                        <div className="text-gray-500 mt-0.5">Cost: {p.budget}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INQUIRY FORM MODAL */}
      <AnimatePresence>
        {inquiryModalContractor && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl"
            >
              <button
                onClick={() => setInquiryModalContractor(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Contact {inquiryModalContractor.name}</h3>
              <p className="text-xs text-gray-600">Send direct project details & inquiry to this verified builder.</p>

              <form onSubmit={handleInquirySubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Your Name</label>
                  <Input
                    required
                    value={inquiryForm.customerName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, customerName: e.target.value })}
                    placeholder="E.g., Ananya Rao"
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone Number</label>
                  <Input
                    required
                    value={inquiryForm.customerPhone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Email</label>
                  <Input
                    required
                    type="email"
                    value={inquiryForm.customerEmail}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, customerEmail: e.target.value })}
                    placeholder="ananya@example.com"
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Project Requirements</label>
                  <Textarea
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Looking for 3BHK house construction on 30x40 plot in Bengaluru..."
                    className="h-20 rounded-xl border-gray-200"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-[#B8860B] hover:bg-[#997320] text-white rounded-full font-bold text-xs mt-2">
                  Send Inquiry Now
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
