# Aurelia Jewellery - Frontend

React + Vite storefront, deployed on Vercel. The backend lives on Render.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

With no environment variables set, the app talks to `http://localhost:5001`
(start the backend with `npm run dev` in `backend/`).

## Production (Vercel)

1. Vercel > Project > Settings > Environment Variables:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://<your-service>.onrender.com` (https, no trailing slash, no `/api`) |

2. Redeploy. Vite bakes this value in **at build time**, so changing it
   always requires a new deployment.

The build **fails on purpose** if `VITE_API_URL` is missing, points to
localhost / a private IP, or is not `https`. This guarantees a production
build can never talk to a local backend. See `validate-api-url.js`.

To test a production build on your machine:

```bash
VITE_API_URL=https://<your-service>.onrender.com npm run build
npm run preview
```

## Optional: same-origin API (recommended for Safari / iPhone)

If the frontend (vercel.app) and backend (onrender.com) are on different
sites, Safari and some other browsers block the login cookie as a
"third-party cookie". To avoid that, set `VITE_API_URL=same-origin` and make
sure the `/api/:path*` rewrite in `vercel.json` points to your real Render URL.
