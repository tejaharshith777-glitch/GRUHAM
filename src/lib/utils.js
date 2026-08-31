import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely (later classes win). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Build the URL of an app page: "Blueprint Generator" -> "/Blueprint-Generator" */
export function createPageUrl(pageName) {
  return "/" + pageName.replace(/ /g, "-");
}
