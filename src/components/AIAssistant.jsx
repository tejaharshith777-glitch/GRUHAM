import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Building2,
  House,
  LoaderCircle,
  MessageSquare,
  Send,
  Sofa,
  Sparkles,
  TreePine,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { base44 } from "../lib/base44";
import { computeBOQ, inrShort } from "../lib/boq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const assistantQuickActions = [
  {
    icon: House,
    label: "Design Full House",
    page: "BlueprintGenerator",
  },
  {
    icon: Sofa,
    label: "Interior Design",
    page: "InteriorDesign",
  },
  {
    icon: Building2,
    label: "Exterior Design",
    page: "ExteriorDesign",
  },
  {
    icon: TreePine,
    label: "Compound Design",
    page: "CompoundDesign",
  },
];
export default function AIAssistant() {
  const [e, t] = useState(false),
    [n, r] = useState([
      {
        role: "assistant",
        content: `Namaste! 🏠 I'm your Dream Home AI assistant. I can help you:

• Design your dream house with AI
• Find contractors near you
• Estimate material costs
• Guide you through the design process

What would you like to build today?`,
      },
    ]),
    [o, l] = useState(""),
    [c, d] = useState(false),
    h = useRef(null);
  useEffect(() => {
    var m;
    (m = h.current) == null ||
      m.scrollIntoView({
        behavior: "smooth",
      });
  }, [n]);
  const p = async () => {
    if (!o.trim() || c) return;
    const m = o.trim();
    (l(""),
      r((y) => [
        ...y,
        {
          role: "user",
          content: m,
        },
      ]),
      d(true));
    setTimeout(() => {
      let response = "I'm your offline GRUHAM assistant! You can use the buttons below to navigate to our design tools.";
      let suggestedPage = null;
      let showQuickActions = true;

      const lower = m.toLowerCase();
      if (lower.includes("cost") || lower.includes("price") || lower.includes("estimate") || lower.includes("sq ft") || lower.includes("sqft")) {
        // Try to find a number in the query
        const match = m.match(/(\d+[,.]?\d*)\s*(sq\s*ft|square\s*feet|sqft)/i) || m.match(/(\d+[,.]?\d*)/);
        let sqft = 1000;
        if (match && match[1]) {
          sqft = parseFloat(match[1].replace(/,/g, ''));
        }
        if (sqft > 100) {
          const res = computeBOQ({ builtUpArea: sqft, city: "Chennai", finish: "standard" });
          response = `For a ${sqft} sq ft home, the indicative construction cost is approximately ${inrShort(res.band_low)} to ${inrShort(res.band_high)}. This is for standard finishes in a typical metro city.\n\n*Note: This is an indicative estimate (±15%). Please use our detailed Materials estimator for a complete breakdown.*`;
          suggestedPage = "Materials";
        }
      } else if (lower.includes("contractor") || lower.includes("builder")) {
        response = "You can find local registered contractors on our Contractors page. (Note: The verified marketplace is launching soon!)";
        suggestedPage = "Contractors";
      } else if (lower.includes("interior") || lower.includes("room")) {
        response = "I can help you visualize your interior spaces. Try our Interior Design tool!";
        suggestedPage = "InteriorDesign";
      } else if (lower.includes("floor plan") || lower.includes("blueprint") || lower.includes("house")) {
        response = "Ready to plan your plot? Try our Blueprint Generator to get a deterministic room layout.";
        suggestedPage = "BlueprintGenerator";
      }

      r((x) => [
        ...x,
        {
          role: "assistant",
          content: response,
          suggestedPage: suggestedPage,
          showQuickActions: showQuickActions,
        },
      ]);
      d(false);
    }, 600);
  };
  return (
    <>
      <motion.button
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 0.9,
        }}
        onClick={() => t(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </motion.button>
      <AnimatePresence>
        {e && (
          <motion.div
            initial={{
              opacity: 0,
              y: 100,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 100,
              scale: 0.9,
            }}
            className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[380px] h-[75vh] sm:h-[600px] max-h-[calc(100vh-90px)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#B8860B] to-[#D4A84B] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">GRUHAM Assistant</h3>
                  <p className="text-xs text-white/80">AI planning guide — may not always be accurate</p>
                </div>
              </div>
              <button onClick={() => t(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {n.map((m, y) => (
                <div
                  key={y}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${m.role === "user" ? "bg-[#B8860B] text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}
                  >
                    <p className="text-sm whitespace-pre-line">{m.content}</p>
                    {m.showQuickActions && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {assistantQuickActions.map((x, j) => (
                          <Link
                            key={j}
                            to={createPageUrl(x.page)}
                            onClick={() => t(false)}
                            className="flex items-center gap-2 bg-white rounded-lg p-2 text-xs font-medium text-gray-700 hover:bg-[#B8860B] hover:text-white transition-colors"
                          >
                            <x.icon className="w-4 h-4" />
                            {x.label}
                          </Link>
                        ))}
                      </div>
                    )}
                    {m.suggestedPage && (
                      <Link
                        to={createPageUrl(m.suggestedPage)}
                        onClick={() => t(false)}
                        className="mt-2 inline-flex items-center gap-1 text-xs bg-white/20 rounded-full px-3 py-1 hover:bg-white/30"
                      >
                        <Sparkles className="w-3 h-3" />
                        Go to
                        {m.suggestedPage}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {c && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3 rounded-bl-sm">
                    <LoaderCircle className="w-5 h-5 animate-spin text-[#B8860B]" />
                  </div>
                </div>
              )}
              <div ref={h} />
            </div>
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {assistantQuickActions.map((m, y) => (
                  <Link
                    key={y}
                    to={createPageUrl(m.page)}
                    onClick={() => t(false)}
                    className="flex-shrink-0 flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-[#B8860B] hover:text-white transition-colors"
                  >
                    <m.icon className="w-3 h-3" />
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={o}
                  onChange={(m) => l(m.target.value)}
                  onKeyPress={(m) => m.key === "Enter" && p()}
                  placeholder="Ask me anything about your dream home..."
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={p}
                  disabled={c}
                  className="w-10 h-10 rounded-full bg-[#B8860B] hover:bg-[#1a1a1a] p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1">
                AI responses are for guidance only and may not always be accurate.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
