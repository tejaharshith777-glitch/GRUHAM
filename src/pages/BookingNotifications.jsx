import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  CircleCheckBig,
  Mail,
  Phone,
  Star,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";

export default function BookingNotifications() {
  const [e, t] = useState([]),
    [n, r] = useState("all"),
    [o, l] = useState(true);
  useEffect(() => {
    c();
  }, []);
  const c = async () => {
      try {
        const m = await base44.BookingNotification.list("-created_date", 50);
        t(m);
      } catch (m) {
        console.error("Failed to load notifications:", m);
      } finally {
        l(false);
      }
    },
    d = async (m, y) => {
      try {
        (await base44.BookingNotification.update(m, {
          notification_status: y,
        }),
          c());
      } catch (x) {
        console.error("Failed to update notification:", x);
      }
    },
    h = e.filter((m) => (n === "all" ? true : m.notification_status === n)),
    p = (m) =>
      new Date(m).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  return o ? (
    <div className="pt-32 pb-24 bg-[#F8F2EC] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#C8A882] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading booking notifications...</p>
      </div>
    </div>
  ) : (
    <div className="pt-32 pb-24 bg-[#F8F2EC] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#0F0F0F] mb-4">
            Booking Notifications
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and track all incoming appointment bookings from your salon website.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            {
              key: "all",
              label: "All Notifications",
              count: e.length,
            },
            {
              key: "pending",
              label: "Pending",
              count: e.filter((m) => m.notification_status === "pending").length,
            },
            {
              key: "viewed",
              label: "Viewed",
              count: e.filter((m) => m.notification_status === "viewed").length,
            },
            {
              key: "contacted",
              label: "Contacted",
              count: e.filter((m) => m.notification_status === "contacted").length,
            },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => r(m.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${n === m.key ? "bg-[#C8A882] text-white shadow-lg" : "bg-white text-gray-600 hover:bg-[#C8A882]/10 hover:text-[#C8A882] border border-gray-200"}`}
            >
              {m.label}
              <span
                className={`px-2 py-1 rounded-full text-xs ${n === m.key ? "bg-white/20" : "bg-gray-100"}`}
              >
                {m.count}
              </span>
            </button>
          ))}
        </div>
        {h.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {n === "all"
                ? "No booking notifications yet. They will appear here when customers make appointments."
                : `No ${n} notifications at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {h.map((m, y) => {
              return (
                <motion.div
                  key={m.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: y * 0.1,
                  }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${m.notification_status === "pending" ? "bg-orange-400" : m.notification_status === "viewed" ? "bg-blue-400" : "bg-green-400"}`}
                        />
                        <div>
                          <h3 className="font-serif text-xl font-bold text-[#0F0F0F]">
                            New Booking:
                            {m.service_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Booking ID: #{m.booking_id?.slice(-8)?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${m.notification_status === "pending" ? "bg-orange-100 text-orange-700" : m.notification_status === "viewed" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                        >
                          {m.notification_status.charAt(0).toUpperCase() +
                            m.notification_status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Client Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <p>
                            <strong>Name:</strong> {m.client_name}
                          </p>
                          <p>
                            <strong>Email:</strong>
                            <a
                              href={`mailto:${m.client_email}`}
                              className="text-blue-600 hover:underline ml-1"
                            >
                              {m.client_email}
                            </a>
                          </p>
                          <p>
                            <strong>Phone:</strong>
                            <a
                              href={`tel:${m.client_phone}`}
                              className="text-green-600 hover:underline ml-1"
                            >
                              {m.client_phone}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Appointment Details
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <p>
                            <strong>Service:</strong> {m.service_name}
                          </p>
                          <p>
                            <strong>Price:</strong>
                            <span className="text-[#C8A882] font-bold ml-1">
                              ₹{m.service_price?.toLocaleString("en-IN")}
                            </span>
                          </p>
                          <p>
                            <strong>Duration:</strong> {m.service_duration}
                          </p>
                          <p>
                            <strong>Date:</strong> {p(m.appointment_date)}
                          </p>
                          <p>
                            <strong>Time:</strong> {m.appointment_time}
                          </p>
                          {m.special_requests && (
                            <p>
                              <strong>Special Requests:</strong> {m.special_requests}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                      <a
                        href={`tel:${m.client_phone}`}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Client
                      </a>
                      <a
                        href={`mailto:${m.client_email}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Client
                      </a>
                      {m.notification_status === "pending" && (
                        <button
                          onClick={() => d(m.id, "viewed")}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <CircleCheckBig className="w-4 h-4" />
                          Mark as Viewed
                        </button>
                      )}
                      {m.notification_status === "viewed" && (
                        <button
                          onClick={() => d(m.id, "contacted")}
                          className="bg-[#C8A882] text-white px-4 py-2 rounded-lg hover:bg-[#FF5C8D] transition-colors flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Mark as Contacted
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
