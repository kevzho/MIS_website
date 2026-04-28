import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const assetAliases = {
  "/favicon.ico": "/assets/images/favicon.png",
  "/favicon.png": "/assets/images/favicon.png",
  "/favicon.svg": "/assets/images/favicon.svg"
};

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".avif": "image/avif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const escapeText = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function placeholderSvg(width, height, label) {
  const safeWidth = Math.min(Math.max(Number(width) || 640, 120), 2400);
  const safeHeight = Math.min(Math.max(Number(height) || 420, 120), 1800);
  const safeLabel = escapeText(label || `${safeWidth} x ${safeHeight}`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}" role="img" aria-label="${safeLabel}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0c6658"/>
      <stop offset="0.48" stop-color="#145f86"/>
      <stop offset="1" stop-color="#f0c957"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${safeWidth}" height="${safeHeight}" fill="url(#bg)"/>
  <rect width="${safeWidth}" height="${safeHeight}" fill="url(#grid)" opacity="0.52"/>
  <path d="M ${safeWidth * 0.66} 0 H ${safeWidth} V ${safeHeight * 0.34} Z" fill="rgba(255,255,255,0.16)"/>
  <path d="M 0 ${safeHeight * 0.62} L ${safeWidth * 0.36} ${safeHeight} H 0 Z" fill="rgba(12,102,88,0.35)"/>
  <rect x="${safeWidth * 0.08}" y="${safeHeight * 0.18}" width="${safeWidth * 0.84}" height="${safeHeight * 0.64}" rx="20" fill="rgba(10,31,45,0.28)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${Math.max(20, Math.min(safeWidth / 18, 48))}" font-weight="700" fill="#ffffff">${safeLabel}</text>
</svg>`;
}

async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const requested = path.join(root, normalized);

  if (!requested.startsWith(root)) {
    return null;
  }

  const candidates = [];
  if (decoded === "/") {
    candidates.push(path.join(root, "index.html"));
  } else if (path.extname(requested)) {
    candidates.push(requested);
  } else {
    candidates.push(path.join(requested, "index.html"));
    candidates.push(`${requested}.html`);
  }

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const placeholderMatch = url.pathname.match(/^\/api\/placeholder\/(\d+)\/(\d+)$/);

  if (placeholderMatch) {
    const [, width, height] = placeholderMatch;
    response.writeHead(200, {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": mimeTypes[".svg"]
    });
    response.end(placeholderSvg(width, height, url.searchParams.get("label")));
    return;
  }

  try {
    const filePath = await resolveFile(assetAliases[url.pathname] || url.pathname);
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Page not found");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
}).listen(port, host, () => {
  console.log(`Minorities in STEM site running at http://${host}:${port}`);
});
