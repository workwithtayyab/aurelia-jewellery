// Single source of truth for the backend address.
//
//   Development (npm run dev):  http://localhost:5001, unless VITE_API_URL is set.
//   Production (vite build):    VITE_API_URL is REQUIRED and validated at build
//                               time by validate-api-url.js (never localhost,
//                               must be https). There is deliberately no
//                               hard-coded production fallback here.
//
// Special value: VITE_API_URL=same-origin makes the app call /api/... on its
// own domain, which vercel.json forwards to Render. That keeps login cookies
// first-party (works in Safari / Brave / Firefox).

const configured = (import.meta.env.VITE_API_URL || "").trim();

let base;

if (configured === "same-origin") {
  base = "";
} else if (configured) {
  base = configured;
} else if (import.meta.env.DEV) {
  base = "http://localhost:5001";
} else {
  // Unreachable for a normal build (the build fails first). If it ever
  // happens, say so loudly instead of guessing a backend.
  console.error(
    "VITE_API_URL was not set at build time. API calls will fail."
  );
  base = "";
}

const API_BASE_URL = base.replace(/\/+$/, "");

export default API_BASE_URL;
