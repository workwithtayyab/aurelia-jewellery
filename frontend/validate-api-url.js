// Build-time safety check for the backend URL.
//
// A production build must NEVER ship pointing at localhost (or any
// non-HTTPS / private address). This runs inside `vite build`, so a
// bad VITE_API_URL stops the Vercel deployment instead of silently
// producing a site that talks to the wrong backend.

const PRIVATE_HOST =
  /^(localhost|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|\[::1?\])$/i;

export function validateApiUrl(rawValue) {
  const value = (rawValue || "").trim();

  // Same-origin mode: the browser calls /api/... on the Vercel domain and
  // the rewrite in vercel.json forwards it to Render.
  if (value === "same-origin") return { mode: "same-origin", url: "" };

  if (!value) {
    throw new Error(
      "VITE_API_URL is not set for this production build.\n" +
        "  Set it in Vercel > Project > Settings > Environment Variables, e.g.\n" +
        "    VITE_API_URL=https://your-service.onrender.com\n" +
        "  then redeploy."
    );
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `VITE_API_URL is not a valid URL: "${value}". Use the full address, e.g. https://your-service.onrender.com`
    );
  }

  if (PRIVATE_HOST.test(parsed.hostname) || parsed.hostname.endsWith(".localhost")) {
    throw new Error(
      `VITE_API_URL points to a local/private address (${parsed.hostname}).\n` +
        "  A production build must use your Render backend URL, never localhost."
    );
  }

  if (parsed.protocol !== "https:") {
    throw new Error(
      `VITE_API_URL must use https:// in production (got "${parsed.protocol}//"). ` +
        "Login cookies are Secure and will not work over http."
    );
  }

  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    throw new Error(
      `VITE_API_URL must be only the site address with no path (got "${parsed.pathname}"). ` +
        "The app adds /api/... itself."
    );
  }

  return { mode: "direct", url: parsed.origin };
}
