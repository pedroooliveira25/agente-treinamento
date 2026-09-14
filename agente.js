// agente.js — CLI de instalacao + instrucoes. Sem efeito destrutivo, so checa e orienta.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const args = process.argv.slice(2);

function help() {
  console.log([
    "agente-instalacao-treinamento",
    "",
    "uso:",
    "  node agente.js --help      mostra esta ajuda",
    "  node agente.js --check     checa ambiente (node, npm, pastas, slides)",
    "  node agente.js --install   guia de instalacao passo a passo",
    "  node agente.js --treinar   abre instrucao para subir o treinamento",
    ""
  ].join("\n"));
}

function cmd(exe) {
  try {
    return execSync(exe, { encoding: "utf8" }).trim().split("\n")[0];
  } catch {
    return null;
  }
}

function check() {
  console.log("== check ambiente ==");
  const nodeV = cmd("node -v");
  const npmV = cmd("npm -v");
  console.log("node: " + (nodeV || "NAO ENCONTRADO"));
  console.log("npm: " + (npmV || "NAO ENCONTRADO"));

  const pastas = ["treinamento", "instrucoes", "slides", "scripts"];
  for (const p of pastas) {
    const ok = fs.existsSync(path.join(ROOT, p));
    console.log((ok ? "[ok] " : "[falta] ") + p + "/");
  }

  const slidesDir = path.join(ROOT, "slides");
  let arquivos = [];
  if (fs.existsSync(slidesDir)) {
    arquivos = fs.readdirSync(slidesDir).filter(f => !f.startsWith("."));
  }
  console.log("slides/: " + (arquivos.length ? arquivos.join(", ") : "(vazio — coloque slides.pdf + conteudo.txt)"));

  const unificado = path.join(ROOT, "instrucoes", "UNIFICADO.md");
  console.log("instrucoes/UNIFICADO.md: " + (fs.existsSync(unificado) ? "existe" : "falta"));
  const modulos = path.join(ROOT, "treinamento", "modulos.json");
  console.log("treinamento/modulos.json: " + (fs.existsSync(modulos) ? "existe" : "falta"));

  if (!nodeV) {
    console.log("\nInstale o Node LTS 20+ e rode de novo.");
    return;
  }
  console.log("\nTudo certo para rodar: npm start");
}

function install() {
  console.log([
    "== instalacao ==",
    "1. Node 18+ instalado? Rode: node agente.js --check",
    "2. Entre na pasta do projeto e rode: npm start",
    "3. Abra http://localhost:3000",
    "4. Para unificar seus slides:",
    "   - salve o PDF em slides/slides.pdf",
    "   - extraia o texto para slides/conteudo.txt",
    "   - rode: node scripts/unificar.js",
    "5. Recarregue o browser.",
    "",
    "Nada aqui apaga ou altera o sistema. So orienta."
  ].join("\n"));
}

function treinar() {
  console.log("Suba o treinamento com: npm start  ->  http://localhost:3000");
}

if (args.includes("--help") || args.length === 0) help();
else if (args.includes("--check")) check();
else if (args.includes("--install")) install();
else if (args.includes("--treinar")) treinar();
else {
  console.log("flag desconhecida. Use --help");
  process.exitCode = 1;
}
