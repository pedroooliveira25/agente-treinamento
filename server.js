// server.js — static server sem dependencias. Roda treinamento/ em http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "treinamento");
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split("?")[0]);
  const joined = path.join(base, decoded === "/" ? "index.html" : decoded);
  if (!joined.startsWith(base)) return null;
  return joined;
}

const server = http.createServer((req, res) => {
  const file = safeJoin(ROOT, req.url || "/");
  if (!file) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("negado");
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("nao encontrado: " + req.url);
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("treinamento em http://localhost:" + PORT);
  console.log("pasta servida: " + ROOT);
});
