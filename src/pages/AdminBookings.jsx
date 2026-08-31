import { useEffect, useState } from "react";
import {
  Calendar,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Clock,
  Download,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";

const bookingStatusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};
export default function AdminBookings() {
  const [e, t] = useState([]),
    [n, r] = useState([]),
    [o, l] = useState(true),
    [c, d] = useState(null),
    [h, p] = useState("all"),
    [m, y] = useState(""),
    [x, j] = useState("");
  (console.log("AdminBookings component loaded"),
    useEffect(() => {
      _();
    }, []));
  const _ = async () => {
      try {
        (l(true), d(null), console.log("Starting to load appointment data..."));
        let P = [],
          B = [];
        try {
          ((P = await base44.Appointment.list("-created_date", 100)),
            console.log("Appointments loaded successfully:", P?.length || 0));
        } catch (U) {
          (console.warn(
            "Failed to load appointments (this might be expected if no appointments exist yet):",
            U,
          ),
            (P = []));
        }
        try {
          ((B = await base44.BookingNotification.list("-created_date", 100)),
            console.log("Notifications loaded successfully:", B?.length || 0));
        } catch (U) {
          (console.warn(
            "Failed to load notifications (this might be expected if no notifications exist yet):",
            U,
          ),
            (B = []));
        }
        (t(P || []), r(B || []), console.log("Data loading completed successfully"));
      } catch (P) {
        (console.error("Critical error during data loading:", P),
          d(`Failed to load booking data: ${P.message}`));
      } finally {
        l(false);
      }
    },
    S = async (P, B) => {
      try {
        (await base44.Appointment.update(P, {
          status: B,
        }),
          await _(),
          console.log(`Appointment ${P} updated to ${B}`));
      } catch (U) {
        (console.error("Failed to update appointment status:", U),
          alert("Failed to update appointment status. Please try again."));
      }
    },
    N = async (P) => {
      try {
        (await base44.BookingNotification.update(P, {
          notification_status: "viewed",
        }),
          await _(),
          console.log(`Notification ${P} marked as viewed`));
      } catch (B) {
        console.error("Failed to update notification:", B);
      }
    },
    w = (P) => {
      if (!P) return "N/A";
      try {
        return new Date(P).toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return P;
      }
    },
    C = (P) => {
      if (!P) return "N/A";
      try {
        return new Date(P).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      } catch {
        return P;
      }
    },
    E = e.filter((P) => {
      if (!P) return false;
      const B = h === "all" || P.status === h,
        U =
          (P.client_name || "").toLowerCase().includes(m.toLowerCase()) ||
          (P.email || "").toLowerCase().includes(m.toLowerCase()) ||
          (P.phone || "").includes(m) ||
          (P.service || "").toLowerCase().includes(m.toLowerCase()),
        A = !x || P.preferred_date === x;
      return B && U && A;
    }),
    T = () => {
      const P = [
          [
            "Date Created",
            "Client Name",
            "Email",
            "Phone",
            "Service",
            "Price",
            "Appointment Date",
            "Time",
            "Status",
            "Message",
          ].join(","),
          ...E.map((G) =>
            [
              C(G.created_date),
              G.client_name || "",
              G.email || "",
              G.phone || "",
              G.service || "",
              G.service_price || "",
              G.preferred_date || "",
              G.preferred_time || "",
              G.status || "",
              (G.message || "").replace(/,/g, ";"),
            ].join(","),
          ),
        ].join(`
`),
        B = new Blob([P], {
          type: "text/csv",
        }),
        U = URL.createObjectURL(B),
        A = document.createElement("a");
      ((A.href = U),
        (A.download = `serenity_bookings_${new Date().toISOString().split("T")[0]}.csv`),
        document.body.appendChild(A),
        A.click(),
        document.body.removeChild(A),
        URL.revokeObjectURL(U));
    };
  return o
    ? (console.log("Rendering loading state"),
      (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#C8A882] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading booking management dashboard...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
          </div>
        </div>
      ))
    : c
      ? (console.log("Rendering error state:", c),
        (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
            <div className="text-center max-w-md">
              <CircleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-600 mb-4">{c}</p>
              <button
                onClick={_}
                className="bg-[#C8A882] text-white px-6 py-2 rounded-lg hover:bg-[#FF5C8D] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ))
      : (console.log("Rendering main dashboard with", e.length, "appointments"),
        (
          <div className="min-h-screen bg-gray-50 pt-20">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-[#C8A882]" />
                      <div>
                        <h1 className="text-3xl font-serif font-bold text-[#0F0F0F]">
                          SERENITY Admin
                        </h1>
                        <p className="text-gray-600">Booking Management Dashboard</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={_}
                      className="flex items-center gap-2 text-gray-600 hover:text-[#C8A882] transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Refresh
                    </button>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#C8A882]">{e.length}</p>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {e.filter((P) => P.status === "confirmed").length}
                      </p>
                      <p className="text-sm text-gray-600">Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <h4 className="font-bold text-green-800 mb-2">✅ System Status</h4>
                <p className="text-sm text-green-700">Dashboard loaded successfully</p>
                <p className="text-sm text-green-700">
                  Total appointments:
                  {e.length}
                </p>
                <p className="text-sm text-green-700">
                  Filtered appointments:
                  {E.length}
                </p>
                <p className="text-sm text-green-700">
                  Notifications:
                  {n.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, phone, or service..."
                        value={m}
                        onChange={(P) => y(P.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8A882] transition-colors"
                      />
                    </div>
                    <select
                      value={h}
                      onChange={(P) => p(P.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8A882] transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                      type="date"
                      value={x}
                      onChange={(P) => j(P.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8A882] transition-colors"
                    />
                  </div>
                  <button
                    onClick={T}
                    className="flex items-center gap-2 bg-[#C8A882] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF5C8D] transition-colors duration-300"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                </div>
              </div>
              {n.filter((P) => P.notification_status === "pending").length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <CircleAlert className="w-6 h-6 text-orange-600" />
                    <h3 className="font-bold text-orange-800">
                      {n.filter((P) => P.notification_status === "pending").length}
                      New Booking Notifications
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {n
                      .filter((P) => P.notification_status === "pending")
                      .slice(0, 3)
                      .map((P) => (
                        <div
                          key={P.id}
                          className="flex items-center justify-between bg-white rounded-lg p-3"
                        >
                          <div>
                            <span className="font-medium">{P.client_name}</span>
                            <span className="text-gray-600 ml-2">
                              booked
                              {P.service_name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              on
                              {w(P.appointment_date)}
                              at
                              {P.appointment_time}
                            </span>
                          </div>
                          <button
                            onClick={() => N(P.id)}
                            className="text-sm bg-[#C8A882] text-white px-3 py-1 rounded-lg hover:bg-[#FF5C8D] transition-colors"
                          >
                            Mark Viewed
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="grid gap-6">
                {E.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {e.length === 0
                        ? "No appointments yet"
                        : "No appointments match your filters"}
                    </h3>
                    <p className="text-gray-600">
                      {e.length === 0
                        ? "Appointments will appear here once customers start booking."
                        : "Try adjusting your filters or search terms."}
                    </p>
                    {e.length === 0 && (
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
                        className="mt-4 bg-[#C8A882] text-white px-6 py-2 rounded-lg hover:bg-[#FF5C8D] transition-colors"
                      >
                        Test Booking System
                      </button>
                    )}
                  </div>
                ) : (
                  E.map((P) => (
                    <motion.div
                      key={P.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#C8A882]/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-[#C8A882]" />
                            </div>
                            <div>
                              <h3 className="font-serif text-xl font-bold text-[#0F0F0F]">
                                {P.client_name || "N/A"}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <a
                                    href={`mailto:${P.email}`}
                                    className="hover:text-[#C8A882] break-all"
                                  >
                                    {P.email || "N/A"}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  <a href={`tel:${P.phone}`} className="hover:text-[#C8A882]">
                                    {P.phone || "N/A"}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${bookingStatusStyles[P.status] || bookingStatusStyles.pending}`}
                            >
                              {P.status
                                ? P.status.charAt(0).toUpperCase() + P.status.slice(1)
                                : "Pending"}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{(P.id || "").slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#C8A882]" />
                            <div>
                              <p className="font-medium text-[#0F0F0F]">{P.service || "N/A"}</p>
                              <p className="text-sm text-gray-600">
                                {P.service_price
                                  ? `₹${P.service_price.toLocaleString("en-IN")}`
                                  : "Price N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="font-medium text-[#0F0F0F]">{w(P.preferred_date)}</p>
                              <p className="text-sm text-gray-600">Appointment Date</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="font-medium text-[#0F0F0F]">
                                {P.preferred_time || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {P.duration || "Duration N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleAlert className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-[#0F0F0F]">{C(P.created_date)}</p>
                              <p className="text-sm text-gray-600">Booked On</p>
                            </div>
                          </div>
                        </div>
                        {P.message && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Special Requests:
                                </p>
                                <p className="text-sm text-gray-600">{P.message}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-500">
                            Last updated:
                            {C(P.updated_date)}
                          </div>
                          <div className="flex items-center gap-2">
                            {P.status === "pending" && (
                              <>
                                <button
                                  onClick={() => S(P.id, "confirmed")}
                                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                  <CircleCheckBig className="w-4 h-4" />
                                  Confirm
                                </button>
                                <button
                                  onClick={() => S(P.id, "cancelled")}
                                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                  <CircleX className="w-4 h-4" />
                                  Cancel
                                </button>
                              </>
                            )}
                            {P.status === "confirmed" && (
                              <button
                                onClick={() => S(P.id, "completed")}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                <CircleCheckBig className="w-4 h-4" />
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              <div className="mt-12 grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {e.filter((P) => P.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Approval</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CircleCheckBig className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {e.filter((P) => P.status === "confirmed").length}
                  </p>
                  <p className="text-sm text-gray-600">Confirmed</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {e.filter((P) => P.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-[#C8A882]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-[#C8A882]" />
                  </div>
                  <p className="text-2xl font-bold text-[#C8A882]">
                    ₹{e.reduce((P, B) => P + (B.service_price || 0), 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        ));
}
