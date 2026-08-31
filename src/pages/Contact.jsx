import { useState } from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [e, t] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    }),
    [o, l] = useState(false),
    c = (d) => {
      d.preventDefault();
      // Open mailto: with pre-filled content — no server receives this data.
      const body = encodeURIComponent(
        `Name: ${e.name}\nEmail: ${e.email}\n\n${e.message}`
      );
      const subject = encodeURIComponent(e.subject || "GRUHAM Enquiry");
      window.location.href = `mailto:hello@gruhamapp.com?subject=${subject}&body=${body}`;
      l(true);
      t({ name: "", email: "", subject: "", message: "" });
    },
    whatsapp = () => {
      const text = encodeURIComponent(
        `Hi GRUHAM team!\nName: ${e.name}\nQuery: ${e.message}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    };
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
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Get In Touch</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions about GRUHAM? We read every message and reply within 1 business day (IST).
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6">
                Send Us a Message
              </h2>
              {o ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">
                    Opening your email app...
                  </h3>
                  <p className="text-gray-600 mb-2">Your default email app has been opened with a pre-filled message to hello@gruhamapp.com.</p>
                  <p className="text-xs text-gray-400 mb-6">No form data is sent to any server.</p>
                  <Button
                    onClick={() => l(false)}
                    variant="outline"
                    className="rounded-full border-[#B8860B] text-[#B8860B]"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={c} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                      <Input
                        value={e.name}
                        onChange={(d) =>
                          t({
                            ...e,
                            name: d.target.value,
                          })
                        }
                        placeholder="Your name"
                        required={true}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={e.email}
                        onChange={(d) =>
                          t({
                            ...e,
                            email: d.target.value,
                          })
                        }
                        placeholder="you@example.com"
                        required={true}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                    <Input
                      value={e.subject}
                      onChange={(d) =>
                        t({
                          ...e,
                          subject: d.target.value,
                        })
                      }
                      placeholder="How can we help?"
                      required={true}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                    <Textarea
                      value={e.message}
                      onChange={(d) =>
                        t({
                          ...e,
                          message: d.target.value,
                        })
                      }
                      placeholder="Tell us more about your question..."
                      required={true}
                      className="min-h-[150px] rounded-xl"
                    />
                  </div>
                   <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-amber-700">No server receives your data. Clicking Send opens your email app pre-filled.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-[#B8860B] hover:bg-[#1a1a1a] text-white rounded-full font-semibold"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Open Email App
                    </Button>
                    <Button
                      type="button"
                      onClick={whatsapp}
                      variant="outline"
                      className="flex-1 h-12 rounded-full border-green-500 text-green-700 hover:bg-green-50"
                    >
                      WhatsApp Instead
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#B8860B]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Email Us</h4>
                    <a
                      href="mailto:hello@gruhamapp.com"
                      className="text-gray-600 hover:text-[#B8860B] transition-colors"
                    >
                      hello@gruhamapp.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#B8860B]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Live Chat</h4>
                    <p className="text-gray-600">Mon–Sat, 9am–6pm IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#B8860B]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Location</h4>
                    <p className="text-gray-600">India</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#B8860B] to-[#D4A84B] rounded-3xl p-8 text-white">
              <h3 className="font-serif text-xl font-bold mb-4">Have a Quick Question?</h3>
              <p className="text-white/80 mb-6">
                Check out our FAQ section for instant answers to common questions about our AI
                design tool.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-[#B8860B] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                View FAQs
              </a>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <p className="text-gray-600">
                Average response time:
                <span className="font-bold text-[#B8860B]">Under 24 hours</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
