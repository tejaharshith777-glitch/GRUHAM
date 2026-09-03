import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import {
  Building,
  CheckCircle,
  MapPin,
  Phone,
  Briefcase,
  Star,
  Edit,
  Save,
  UserCheck,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ContractorDashboard() {
  const { userProfile, updateContractorProfile } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    area: "",
    specialization: "Civil Construction",
    experience: "5",
    bio: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        city: userProfile.city || "",
        area: userProfile.area || "",
        specialization: userProfile.specialization || "Civil Construction",
        experience: String(userProfile.experience || 5),
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateContractorProfile({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        area: formData.area,
        specialization: formData.specialization,
        specializations: [formData.specialization],
        experience: Number(formData.experience) || 0,
        experience_years: Number(formData.experience) || 0,
        bio: formData.bio,
      });
      setIsEditing(false);
      toast.success("Contractor profile & directory listing updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update contractor profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#B8860B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Verified Contractor Partner
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {userProfile?.name || "Contractor Dashboard"}
            </h1>
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B8860B]" />
              {userProfile?.city ? `${userProfile.city}${userProfile?.area ? `, ${userProfile.area}` : ""}` : "Location not set"}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              to="/Contractors"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" /> View Public Directory
            </Link>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#B8860B] hover:bg-[#D4A84B] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>

          {/* Decorative glow background */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#B8860B]/15 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Experience</span>
              <Briefcase className="w-5 h-5 text-[#B8860B]" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a] font-serif">
              {userProfile?.experience || 5} Years
            </p>
            <p className="text-xs text-gray-500">Verified in Firestore</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#B8860B]/15 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Directory Rating</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a] font-serif">
              5.0 / 5.0
            </p>
            <p className="text-xs text-emerald-600 font-semibold">Verified Partner Badge Active</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#B8860B]/15 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Contact Status</span>
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-[#1a1a1a] truncate">
              {userProfile?.phone || "No phone added"}
            </p>
            <p className="text-xs text-gray-500">Visible to customer enquiries</p>
          </div>
        </div>

        {/* Profile Content / Editing Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-serif font-bold text-[#1a1a1a]">
              Listing & Profile Information
            </h2>
            <span className="text-xs text-gray-400 font-mono">UID: {userProfile?.uid}</span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Company / Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Public Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Area / Locality</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Specialization</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  >
                    <option value="Civil Construction">Civil Construction</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Electrical Work">Electrical Work</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Exterior Design">Exterior Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full md:w-1/3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Bio / About Services</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your construction specialization, turnkey villa projects, Vastu compliance expertise..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#B8860B] hover:bg-[#1a1a1a] text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  {loading ? "Saving to Firestore..." : "Save Profile & Listing"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Specialization
                  </h4>
                  <p className="text-lg font-semibold text-[#1a1a1a] mt-1">
                    {userProfile?.specialization || "Civil Construction"}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Service Location
                  </h4>
                  <p className="text-lg font-semibold text-[#1a1a1a] mt-1">
                    {userProfile?.city} {userProfile?.area ? `(${userProfile.area})` : ""}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Business Description & Bio
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                  {userProfile?.bio || "No business description provided yet. Click 'Edit Profile' to add details about your turnkey construction or interior work."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
