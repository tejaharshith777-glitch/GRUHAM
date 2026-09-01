import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let globalToastHandler = null;

export const toast = (message, type = "info") => {
  if (globalToastHandler) {
    globalToastHandler(message, type);
  } else {
    console.log(`[Toast ${type}]:`, message);
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  globalToastHandler = addToast;

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl text-sm font-medium border backdrop-blur-md ${
                t.type === "error"
                  ? "bg-red-900/90 text-white border-red-700"
                  : t.type === "success"
                  ? "bg-emerald-900/90 text-white border-emerald-700"
                  : "bg-[#1a1a1a]/95 text-white border-amber-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {t.type === "info" && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
                <p className="leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-3 text-white/70 hover:text-white shrink-0 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { toast };
  }
  return { toast: ctx.addToast };
}
