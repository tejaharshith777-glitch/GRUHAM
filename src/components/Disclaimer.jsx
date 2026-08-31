import { AlertTriangle } from "lucide-react";

/**
 * Honest disclaimer shown at the top of generator pages.
 *
 * variant="generator" — for AI image / plan generators
 * variant="cost"      — for cost estimator pages
 */
export default function Disclaimer({ variant = "generator" }) {
  const messages = {
    generator:
      "Concept designs only — AI images are visual concepts, not architectural drawings. " +
      "Have a licensed architect and structural engineer review them before construction.",
    cost:
      "Cost estimates are indicative (±15–30%) and are not a contractor quotation. " +
      "Rates are based on current market inputs for the selected city. Always get written quotes before committing.",
  };

  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 mb-6">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 leading-relaxed">
        <strong className="font-semibold">Note: </strong>
        {messages[variant]}
      </p>
    </div>
  );
}
