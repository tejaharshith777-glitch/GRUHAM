import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  Building2,
  ChevronRight,
  House,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Send,
  Sofa,
  Sparkles,
  TreePine,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const assistantQuickActions = [
  { icon: House, label: "2D Blueprint", page: "BlueprintGenerator" },
  { icon: Sofa, label: "Interior Design", page: "InteriorDesign" },
  { icon: Building2, label: "Exterior Facade", page: "ExteriorDesign" },
  { icon: TreePine, label: "House Catalog", page: "CompoundDesign" },
  { icon: Sparkles, label: "Materials & BOQ", page: "Materials" },
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! 🏠 I am your GRUHAM AI Home Construction Assistant. Ask me anything about floor plans, Vastu compliance, material rates in INR, or finding local builders!",
      suggestedPage: null,
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle Multi-Turn LLM Send
  const handleSendMessage = async (userPromptOverride) => {
    const textToSend = userPromptOverride || inputQuery.trim();
    if (!textToSend || isLoading) return;

    setErrorState(null);
    setInputQuery("");

    // Append User Message
    const updatedMessages = [
      ...messages,
      { role: "user", content: textToSend }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build conversation context for multi-turn LLM query
      const conversationContext = updatedMessages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n\n");

      const promptToLLM = `System: You are GRUHAM AI, an expert Indian home design & construction assistant. Help the user with blueprints, Vastu Shastra, material rates, contractor recommendations, or interior/exterior styling. Keep answers helpful, concise, and structured.\n\n${conversationContext}\n\nASSISTANT:`;

      // Call AI Engine
      const llmResult = await base44.integrations.Core.InvokeLLM({ prompt: promptToLLM });

      let botReplyText = "";
      let suggestedPage = null;

      if (typeof llmResult === "string") {
        botReplyText = llmResult;
      } else if (llmResult?.response) {
        botReplyText = llmResult.response;
        suggestedPage = llmResult.suggested_page || null;
      } else {
        botReplyText = "I can help you design your home, estimate construction BOQ, or connect with contractors! Use the quick links below to explore GRUHAM's tools.";
      }

      // Keyword-based page route suggestion fallback
      const lower = textToSend.toLowerCase();
      if (/blueprint|floor plan|plot|bhk|floors/i.test(lower)) suggestedPage = "BlueprintGenerator";
      else if (/interior|living room|bedroom|kitchen/i.test(lower)) suggestedPage = "InteriorDesign";
      else if (/exterior|facade|elevation|roof/i.test(lower)) suggestedPage = "ExteriorDesign";
      else if (/house catalog|villa|duplex|compound/i.test(lower)) suggestedPage = "CompoundDesign";
      else if (/cost|price|estimate|rate|cement|steel|material/i.test(lower)) suggestedPage = "Materials";
      else if (/contractor|builder|labor|hire/i.test(lower)) suggestedPage = "Contractors";

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: botReplyText, suggestedPage }
      ]);
    } catch (err) {
      console.error("Chatbot API Error:", err);
      setErrorState("Connection timeout. Please click Retry to re-send.");
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-[#B8860B] border border-[#B8860B]/40 p-4 rounded-full shadow-2xl flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Sparkles className="w-6 h-6 text-[#B8860B] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-black" />
          </div>
        )}
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B8860B]/20 flex items-center justify-center border border-[#B8860B]">
                  <Bot className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                    GRUHAM AI Assistant
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    Online • Real AI Context
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#B8860B]/30">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[82%] text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1a1a1a] text-white p-3.5 rounded-2xl rounded-tr-none shadow-md"
                      : "bg-white text-gray-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 space-y-2"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Direct Page Action Link */}
                    {msg.suggestedPage && (
                      <div className="pt-2 border-t border-gray-100">
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(createPageUrl(msg.suggestedPage));
                          }}
                          className="w-full bg-[#B8860B] hover:bg-[#997320] text-white text-[11px] font-bold h-8 rounded-full flex items-center justify-center gap-1"
                        >
                          Open {msg.suggestedPage} Studio
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl w-fit shadow-sm border border-gray-100">
                  <LoaderCircle className="w-4 h-4 text-[#B8860B] animate-spin" />
                  <span>GRUHAM AI is thinking...</span>
                </div>
              )}

              {/* Error & Retry Banner */}
              {errorState && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{errorState}</span>
                  </div>
                  <Button
                    onClick={() => handleSendMessage("Please retry my previous message.")}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1 rounded-full h-7"
                  >
                    Retry
                  </Button>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto select-none">
              {assistantQuickActions.map((qa) => (
                <button
                  key={qa.page}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(createPageUrl(qa.page));
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-[#B8860B]/10 hover:text-[#B8860B] rounded-full text-[10px] font-semibold text-gray-700 whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <qa.icon className="w-3 h-3 text-[#B8860B]" />
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <Input
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about 3BHK costs, Vastu, or blueprints..."
                className="rounded-full text-xs h-10 border-gray-200 focus:ring-[#B8860B]"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputQuery.trim()}
                className="bg-[#B8860B] hover:bg-[#997320] text-white rounded-full p-2.5 h-10 w-10 flex-shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
