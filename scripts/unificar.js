// scripts/unificar.js — junta slides/*.txt em instrucoes/UNIFICADO.md + treinamento/modulos.json
// Uso: node scripts/unificar.js
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SLIDES = path.join(ROOT, "slides");
const OUT_MD = path.join(ROOT, "instrucoes", "UNIFICADO.md");
const OUT_JSON = path.join(ROOT, "treinamento", "modulos.json");

function lerTxts() {
  if (!fs.existsSync(SLIDES)) return [];
  return fs.readdirSync(SLIDES)
    .filter(f => f.toLowerCase().endsWith(".txt"))
    .sort()
    .map(f => {
      const full = path.join(SLIDES, f);
      const texto = fs.readFileSync(full, "utf8").trim();
      return { arquivo: f, texto };
    })
    .filter(x => x.texto.length > 0);
}

function quebrarEmModulos(blocos) {
  // Cada arquivo .txt vira um modulo; dentro dele, linhas "## " viram secoes.
  const modulos = [];
  blocos.forEach((b, i) => {
    const linhas = b.texto.split(/\r?\n/);
    let titulo = b.arquivo.replace(/\.txt$/i, "").replace(/[-_]+/g, " ");
    const secoes = [];
    let atual = { titulo: "Visão geral", corpo: [] };
    for (const ln of linhas) {
      const m = ln.match(/^##\s+(.*)/);
      if (m) {
        if (atual.corpo.length || atual.titulo !== "Visão geral") secoes.push(atual);
        atual = { titulo: m[1].trim(), corpo: [] };
      } else {
        atual.corpo.push(ln);
      }
    }
    secoes.push(atual);
    modulos.push({
      id: "m" + (i + 1),
      titulo: titulo,
      fonte: b.arquivo,
      secoes: secoes.map((s, j) => ({
        id: "m" + (i + 1) + "-s" + (j + 1),
        titulo: s.titulo,
        corpo: s.corpo.join("\n").trim()
      }))
    });
  });
  return modulos;
}

function baseExemplo() {
  return [
    {
      id: "m1",
      titulo: "Instalação base",
      fonte: "exemplo",
      secoes: [
        { id: "m1-s1", titulo: "Pré-requisitos", corpo: "Node 18+, browser moderno, PDF dos slides em slides/slides.pdf." },
        { id: "m1-s2", titulo: "Subir o ambiente", corpo: "Rode `npm start` e abra http://localhost:3000" }
      ]
    },
    {
      id: "m2",
      titulo: "Agentes IA na prática",
      fonte: "exemplo",
      secoes: [
        { id: "m2-s1", titulo: "O que o agente faz", corpo: "Checa ambiente (--check), guia instalação (--install) e aponta para o treinamento (--treinar)." },
        { id: "m2-s2", titulo: "Evolução", corpo: "Troque o conteúdo base pelo seu slides/conteudo.txt e rode node scripts/unificar.js" }
      ]
    },
    {
      id: "m3",
      titulo: "Checklist final",
      fonte: "exemplo",
      secoes: [
        { id: "m3-s1", titulo: "Validar", corpo: "- [ ] npm start abre sem erro\n- [ ] módulos navegáveis\n- [ ] UNIFICADO.md gerado" }
      ]
    }
  ];
}

function gerarMd(modulos, origem) {
  const l = [];
  l.push("# Instruções unificadas — agente-instalacao-treinamento");
  l.push("");
  l.push("_Origem: " + origem + " | Gerado em " + new Date().toISOString() + "_");
  l.push("");
  modulos.forEach((m, i) => {
    l.push("## Módulo " + (i + 1) + " — " + m.titulo);
    l.push("");
    l.push("_Fonte: " + m.fonte + "_");
    l.push("");
    m.secoes.forEach(s => {
      l.push("### " + s.titulo);
      l.push("");
      l.push(s.corpo || "(sem conteúdo)");
      l.push("");
    });
  });
  l.push("---");
  l.push("Para regenerar: coloque .txt em slides/ e rode `node scripts/unificar.js`.");
  return l.join("\n");
}

(function main() {
  const blocos = lerTxts();
  let modulos, origem;
  if (blocos.length === 0) {
    modulos = baseExemplo();
    origem = "exemplo embutido (slides/*.txt vazio)";
  } else {
    modulos = quebrarEmModulos(blocos);
    origem = blocos.map(b => b.arquivo).join(", ");
  }
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_MD, gerarMd(modulos, origem), "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({ origem, modulos }, null, 2), "utf8");
  console.log("blocos lidos: " + blocos.length);
  console.log("origem: " + origem);
  console.log("gerado: instrucoes/UNIFICADO.md");
  console.log("gerado: treinamento/modulos.json (" + modulos.length + " modulos)");
})();
