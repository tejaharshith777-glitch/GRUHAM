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
    try {
      const y = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful AI assistant for "Dream Home Architect" app in India. Help users with:
- Designing houses (suggest they go to Blueprint Generator for full house, Interior Design for rooms, Exterior Design for facades, Compound Design for gardens/parking)
- Finding contractors (suggest Contractors page)
- Material costs in INR (give approximate ranges)
- Budget estimation for construction in India

User message: ${m}

Respond helpfully and concisely. Use Indian context (INR, local materials, Indian architectural styles). If they describe a house requirement, summarize it and suggest the right section to visit. Keep responses under 150 words.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: {
              type: "string",
            },
            suggested_page: {
              type: "string",
            },
            show_quick_actions: {
              type: "boolean",
            },
          },
        },
      });
      r((x) => [
        ...x,
        {
          role: "assistant",
          content: y.response,
          suggestedPage: y.suggested_page,
          showQuickActions: y.show_quick_actions,
        },
      ]);
    } catch {
      r((x) => [
        ...x,
        {
          role: "assistant",
          content:
            "I apologize, I'm having trouble responding right now. Please try again or explore our design sections directly!",
        },
      ]);
    }
    d(false);
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#B8860B] to-[#D4A84B] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Dream Home AI</h3>
                  <p className="text-xs text-white/80">Your design assistant</p>
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
                      <div className="grid grid-cols-2 gap-2 mt-3">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
