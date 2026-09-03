import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import {
  User,
  HardHat,
  Mail,
  Lock,
  Phone,
  Building,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const initialMode = searchParams.get("mode") || "signup"; // "signup" | "login"
  const initialRole = searchParams.get("role"); // "customer" | "contractor" | null

  const {
    currentUser,
    userProfile,
    loginWithEmail,
    signupCustomerWithEmail,
    signupContractorWithEmail,
    loginWithGoogle,
    completeProfile,
    isConfigured,
  } = useAuth();
  
  const toast = useToast();

  // Navigation steps: "role_select" | "auth_form" | "login_direct"
  const [step, setStep] = useState(
    initialMode === "login" ? "login_direct" : initialRole ? "auth_form" : "role_select"
  );
  
  const [selectedRole, setSelectedRole] = useState(initialRole || "customer");
  const [isLoginTab, setIsLoginTab] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);

  // Form states
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [contractorData, setContractorData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    specialization: "Civil Construction",
    experience: "5",
    bio: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [completionData, setCompletionData] = useState({
    phone: "",
    city: "",
    area: "",
    specialization: "Civil Construction",
    experience: "5",
    bio: "",
  });

  // Handle redirect if user is already logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      if (userProfile.needsProfileCompletion) {
        setShowProfileCompletionModal(true);
      } else {
        const dest =
          returnTo ||
          (userProfile.role === "contractor"
            ? "/ContractorDashboard"
            : "/DesignLibrary");
        navigate(dest, { replace: true });
      }
    }
  }, [currentUser, userProfile, navigate, returnTo]);

  // Google Authentication Trigger
  const handleGoogleAuth = async (roleForSignup) => {
    try {
      setLoading(true);
      const res = await loginWithGoogle(roleForSignup);
      toast.success("Signed in with Google successfully!");
      if (res?.isNewUser) {
        setShowProfileCompletionModal(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  // Direct Unified Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const profile = await loginWithEmail(loginData.email, loginData.password);
      toast.success("Welcome back to GRUHAM!");
      const dest =
        returnTo ||
        (profile?.role === "contractor"
          ? "/ContractorDashboard"
          : "/DesignLibrary");
      navigate(dest, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Customer Signup Submit
  const handleCustomerSignup = async (e) => {
    e.preventDefault();
    if (!customerData.email || !customerData.password || !customerData.name) {
      toast.error("Please complete all required fields.");
      return;
    }
    try {
      setLoading(true);
      await signupCustomerWithEmail(customerData);
      toast.success("Customer account created successfully!");
      navigate(returnTo || "/DesignLibrary", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Customer registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Contractor Signup Submit
  const handleContractorSignup = async (e) => {
    e.preventDefault();
    if (
      !contractorData.email ||
      !contractorData.password ||
      !contractorData.name ||
      !contractorData.city ||
      !contractorData.phone
    ) {
      toast.error("Please fill in your company name, city, phone, email, and password.");
      return;
    }
    try {
      setLoading(true);
      await signupContractorWithEmail(contractorData);
      toast.success("Contractor account registered & profile published!");
      navigate("/ContractorDashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Contractor registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Profile Completion Submit (for first time Google Users)
  const handleCompletionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await completeProfile(completionData);
      setShowProfileCompletionModal(false);
      toast.success("Profile details saved!");
      const dest =
        userProfile?.role === "contractor"
          ? "/ContractorDashboard"
          : "/DesignLibrary";
      navigate(dest, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {!isConfigured && (
        <div className="max-w-md w-full mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p>
            Firebase configuration keys are pending in your <code className="font-mono text-xs font-bold">.env</code> file. Please update credentials from Firebase Console.
          </p>
        </div>
      )}

      <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#B8860B]/15">
        
        {/* Step 1: Role Selection Landing Screen */}
        {step === "role_select" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-center"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                Welcome to GRUHAM
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Select your account type to get started
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Option 1: Customer */}
              <button
                onClick={() => {
                  setSelectedRole("customer");
                  setStep("auth_form");
                  setIsLoginTab(false);
                }}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-[#B8860B] hover:bg-[#FAF8F5] transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a1a] font-serif">
                    I am a Customer
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Looking for custom home floor plans, interior/exterior designs, BOQ estimates & contractors.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#B8860B] group-hover:translate-x-1 transition-transform">
                  <span>Continue as Customer</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Option 2: Contractor */}
              <button
                onClick={() => {
                  setSelectedRole("contractor");
                  setStep("auth_form");
                  setIsLoginTab(false);
                }}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-[#B8860B] hover:bg-[#FAF8F5] transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a1a] font-serif">
                    I am a Contractor
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Civil builder, interior studio, electrician or architect listing services in our directory.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#B8860B] group-hover:translate-x-1 transition-transform">
                  <span>Register Contractor Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-center items-center gap-2 text-sm text-gray-600">
              <span>Already have an account?</span>
              <button
                onClick={() => setStep("login_direct")}
                className="text-[#B8860B] font-bold hover:underline"
              >
                Sign In directly
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Role Auth Form (Customer / Contractor) */}
        {step === "auth_form" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B8860B] uppercase">
                  {selectedRole === "customer" ? "Customer Portal" : "Contractor Partner"}
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mt-0.5">
                  {isLoginTab ? "Welcome Back" : `Sign Up as ${selectedRole === "customer" ? "Customer" : "Contractor"}`}
                </h2>
              </div>
              <button
                onClick={() => setStep("role_select")}
                className="text-xs text-gray-500 hover:text-[#B8860B] underline"
              >
                Change Role
              </button>
            </div>

            {/* Google Social Login Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleGoogleAuth(selectedRole)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium text-sm text-gray-700 shadow-sm transition-all hover:scale-[1.01]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <span className="absolute bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">
                Or email signup
              </span>
              <div className="w-full border-t border-gray-200" />
            </div>

            {/* Email Forms */}
            {selectedRole === "customer" ? (
              <form onSubmit={handleCustomerSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ananya Rao"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={customerData.password}
                      onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#B8860B] hover:bg-[#1a1a1a] text-white font-bold rounded-xl text-sm shadow-lg transition-all duration-300 mt-2"
                >
                  {loading ? "Creating Account..." : "Create Customer Account"}
                </button>
              </form>
            ) : (
              /* Contractor Registration Form */
              <form onSubmit={handleContractorSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Business / Contractor Name *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Sharma Constructions"
                        value={contractorData.name}
                        onChange={(e) => setContractorData({ ...contractorData, name: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={contractorData.phone}
                        onChange={(e) => setContractorData({ ...contractorData, phone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Mumbai / Bengaluru / Hyderabad"
                        value={contractorData.city}
                        onChange={(e) => setContractorData({ ...contractorData, city: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="Andheri West / Indiranagar"
                      value={contractorData.area}
                      onChange={(e) => setContractorData({ ...contractorData, area: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      value={contractorData.specialization}
                      onChange={(e) => setContractorData({ ...contractorData, specialization: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                    >
                      <option value="Civil Construction">Civil Construction</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Electrical Work">Electrical Work</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Exterior Design">Exterior Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={contractorData.experience}
                      onChange={(e) => setContractorData({ ...contractorData, experience: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@sharmaconstructions.in"
                    value={contractorData.email}
                    onChange={(e) => setContractorData({ ...contractorData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={contractorData.password}
                    onChange={(e) => setContractorData({ ...contractorData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1a1a1a] hover:bg-[#B8860B] text-white font-bold rounded-xl text-xs shadow-lg transition-all duration-300 mt-2"
                >
                  {loading ? "Registering Contractor..." : "Register & Publish Contractor Listing"}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                onClick={() => setStep("login_direct")}
                className="text-xs text-gray-500 hover:text-[#B8860B]"
              >
                Already registered? <span className="font-bold underline text-[#B8860B]">Sign in here</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Direct Single Login View */}
        {step === "login_direct" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a]">
                Sign In to GRUHAM
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Role will automatically load from your account record
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleGoogleAuth("customer")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium text-sm text-gray-700 shadow-sm transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <span className="absolute bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">
                Or email password
              </span>
              <div className="w-full border-t border-gray-200" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B8860B] hover:bg-[#1a1a1a] text-white font-bold rounded-xl text-sm shadow-lg transition-all duration-300 mt-2"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setStep("role_select")}
                className="text-xs text-gray-500 hover:text-[#B8860B]"
              >
                Need an account? <span className="font-bold underline text-[#B8860B]">Register here</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Profile Completion Modal for Google Users */}
      <AnimatePresence>
        {showProfileCompletionModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-[#B8860B] uppercase tracking-wider">
                  Almost Done!
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mt-1">
                  Complete Your Profile
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Please provide a few missing details to complete your {userProfile?.role} setup.
                </p>
              </div>

              <form onSubmit={handleCompletionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={completionData.phone}
                    onChange={(e) => setCompletionData({ ...completionData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                {userProfile?.role === "contractor" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="Mumbai"
                          value={completionData.city}
                          onChange={(e) => setCompletionData({ ...completionData, city: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Area</label>
                        <input
                          type="text"
                          placeholder="Andheri West"
                          value={completionData.area}
                          onChange={(e) => setCompletionData({ ...completionData, area: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
                      <select
                        value={completionData.specialization}
                        onChange={(e) => setCompletionData({ ...completionData, specialization: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#B8860B]"
                      >
                        <option value="Civil Construction">Civil Construction</option>
                        <option value="Interior Design">Interior Design</option>
                        <option value="Architecture">Architecture</option>
                        <option value="Electrical Work">Electrical Work</option>
                        <option value="Plumbing">Plumbing</option>
                      </select>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#B8860B] hover:bg-[#1a1a1a] text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
