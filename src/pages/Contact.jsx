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
    [n, r] = useState(false),
    [o, l] = useState(false),
    c = async (d) => {
      (d.preventDefault(),
        r(true),
        await new Promise((h) => setTimeout(h, 1500)),
        r(false),
        l(true),
        t({
          name: "",
          email: "",
          subject: "",
          message: "",
        }));
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
            Have questions about Dream Home Architect? We're here to help you transform your space.
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
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-6">We'll get back to you within 24 hours.</p>
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
                  <Button
                    type="submit"
                    disabled={n}
                    className="w-full h-12 bg-[#B8860B] hover:bg-[#1a1a1a] text-white rounded-full font-semibold"
                  >
                    {n ? "Sending..." : "Send Message"}
                  </Button>
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
                      href="mailto:hello@dreamhomearchitect.com"
                      className="text-gray-600 hover:text-[#B8860B] transition-colors"
                    >
                      hello@dreamhomearchitect.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#B8860B]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Live Chat</h4>
                    <p className="text-gray-600">Available Mon-Fri, 9am-6pm PST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#B8860B]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Location</h4>
                    <p className="text-gray-600">San Francisco, California</p>
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
