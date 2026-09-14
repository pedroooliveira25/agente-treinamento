// PathBit — dashboard: thumbs reais, holders naturais, setas suaves, destaque animado
(async function () {
  const $ = (id) => document.getElementById(id);
  const homeModulos = $("homeModulos"), rowContinue = $("rowContinue"), grade = $("gradeModulos");
  const conteudo = $("conteudo"), busca = $("busca"), origem = $("origem"), barra = $("barraProgresso");
  const KEY = "treinamento-feitos-v1", LAST = "treinamento-ultimo-v1";
  const getF = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
  const setF = (v) => localStorage.setItem(KEY, JSON.stringify(v));
  const thumb = (mi) => "thumbs/m" + (mi + 1) + ".png";
  // módulo Path Insights (mi 7): cada aula usa a capa real do artigo
  const imgDe = (s) => {
    if (s.mi === 7) {
      const n = parseInt(String(s.id).split("-s")[1] || "0", 10);
      if (n > 1 && n <= 9) return "thumbs/insights/i" + (n - 1) + ".jpg";
    }
    return thumb(s.mi);
  };

  function holders(el, n, msg) {
    el.innerHTML = "";
    if (msg) {
      const p = document.createElement("p");
      p.className = "holder-msg"; p.textContent = msg;
      el.before(p);
      setTimeout(() => p.remove(), 900);
    }
    for (let i = 0; i < n; i++) {
      const d = document.createElement("div");
      d.className = "holder";
      d.setAttribute("aria-hidden", "true");
      d.innerHTML = "<div class='h-thumb'></div>";
      el.appendChild(d);
    }
  }
  holders(rowContinue, 3, "Carregando aulas PathBit…");

  let dados;
  try {
    const r = await fetch("modulos.json?v=12");
    dados = await r.json();
    } catch {
    homeModulos.innerHTML = "<p>Falha ao carregar modulos.json. Rode <code>node scripts/unificar.js</code>.</p>";
    return;
  }
  const lista = [];
  dados.modulos.forEach((m, mi) => m.secoes.forEach((s) => lista.push({ mi, mod: m.titulo, ...s })));

  $("stMod").textContent = dados.modulos.length;
  $("stSec").textContent = lista.length;
  origem.textContent = dados.modulos.length + " módulos · " + lista.length + " aulas · PathBit 2026";

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const inline = (t) => {
    let h = esc(t);
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
    h = h.replace(/(https?:\/\/[^\s<]+)/g, "<a href='$1' target='_blank' rel='noopener'>link</a>");
    return h;
  };
  // tipografia: parágrafos com respiro, listas em <ul>, negrito, código e links
  const md = (t) => {
    const blocos = String(t).split(/\n{2,}/);
    return blocos.map((b) => {
      const linhas = b.split("\n").filter((l) => l.trim() !== "");
      if (linhas.length && linhas.every((l) => /^-\s/.test(l.trim()))) {
        return "<ul>" + linhas.map((l) => "<li>" + inline(l.trim().replace(/^-\s/, "").replace(/^\[\s\]\s/, "☐ ")) + "</li>").join("") + "</ul>";
      }
      return "<p>" + linhas.map((l) => inline(l)).join("<br>") + "</p>";
    }).join("");
  };
  const resumo = (t) => esc(String(t).split("\n")[0]).slice(0, 110);

  function prog() {
    const f = getF();
    const pct = Math.round((f.length / (lista.length || 1)) * 100);
    barra.style.width = pct + "%";
    barra.parentElement.setAttribute("aria-valuenow", String(pct));
    $("stPct").textContent = pct + "%";
    return f;
  }
  // mantém aria-selected das abas sincronizado com a aba visível
  function syncTabs(view) {
    document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === view)));
  }
  // Enter/Espaço abre elementos clicáveis (cards, itens da grade)
  function abreComTeclado(el, fn) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };
  }
  // card com thumb real do PDF + infos distribuídas
  function card(s, g, grande) {
    const ok = getF().includes(s.id);
    const el = document.createElement("div");
    el.className = "card-net" + (grande ? " grande" : "");
    el.innerHTML =
      "<div class='thumb-img' style=\"background-image:url('" + imgDe(s) + "')\"><span class='thumb-num'>" + esc("M" + (s.mi + 1)) + "</span></div>" +
      "<div class='info'><div class='tag'>" + esc(s.mod) + "</div><h3>" + esc(s.titulo) + "</h3>" +
      "<p>" + resumo(s.corpo) + "</p>" +
      (grande ? "<div class='extra'>✦ trilha em destaque · comece por aqui para entender a cascata fronteira → fallback</div>" : "") +
      "<div class='meta'><span>~5 min · aula " + (g + 1) + "</span>" + (ok ? "<span class='ok-pill'>✓ concluída</span>" : "<button class='btn-mini' type='button'>Ler</button>") + "</div></div>";
    el.onclick = () => abrir(g);
    return el;
  }

  function fileiraComSetas(titulo, itens, destaque) {
    const wrap = document.createElement("div");
    if (destaque) wrap.className = "destaque-wrap";
    const head = document.createElement("div");
    head.className = "row-head";
    const h = document.createElement("h2");
    h.className = "row-titulo"; h.textContent = titulo;
    const setas = document.createElement("div");
    setas.className = "setas";
    const row = document.createElement("div");
    row.className = "fileira";
    const bL = document.createElement("button"); bL.textContent = "‹"; bL.type = "button";
    const bR = document.createElement("button"); bR.textContent = "›"; bR.type = "button";
    bL.onclick = () => row.scrollBy({ left: -640, behavior: "smooth" });
    bR.onclick = () => row.scrollBy({ left: 640, behavior: "smooth" });
    setas.appendChild(bL); setas.appendChild(bR);
    head.appendChild(h); head.appendChild(setas);
    itens.forEach(({ s, g }) => row.appendChild(card(s, g, destaque)));
    wrap.appendChild(head); wrap.appendChild(row);
    return wrap;
  }

  function render(q) {
    q = (q || "").toLowerCase();
    const f = prog();
    rowContinue.innerHTML = ""; homeModulos.innerHTML = "";
    const casa = (s) => !q || (s.mod + " " + s.titulo + " " + s.corpo).toLowerCase().includes(q);
    // continue enxuto: só a próxima aula (nada de fileira cheia)
    const pend = lista.map((s, g) => ({ s, g })).filter(({ s }) => !f.includes(s.id) && casa(s));
    const prox = pend[0];
    if (!prox) {
      rowContinue.innerHTML = "<div class='continue-ok'>🎉 Tudo concluído. Use Reiniciar para rever.</div>";
    } else {
      const { s, g } = prox;
      const b = document.createElement("div");
      b.className = "continue-banner";
      b.innerHTML = "<img src='" + imgDe(s) + "' alt='Continuar: " + esc(s.titulo) + "'>" +
        "<div class='cb-info'><div class='tag'>" + esc(s.mod) + " · aula " + (g + 1) + "/" + lista.length + "</div>" +
        "<h3>" + esc(s.titulo) + "</h3><p>" + resumo(s.corpo) + "</p></div>" +
        "<button class='btn play' type='button'>▶ Continuar</button>";
      b.querySelector("button").onclick = () => abrir(g);
      rowContinue.appendChild(b);
    }

    // home: só os 7 módulos principais (sem poluir com todas as aulas)
    dados.modulos.forEach((m, mi) => {
      if (q && !(m.titulo + " " + m.secoes.map((s) => s.titulo + " " + s.corpo).join(" ")).toLowerCase().includes(q)) return;
      const tot = m.secoes.length;
      const ok = m.secoes.filter((s) => getF().includes(s.id)).length;
      const pct = Math.round((ok / tot) * 100);
      const d = document.createElement("div");
      d.className = "mod-card home" + (mi === 1 ? " destaque-borda" : "");
      d.innerHTML = "<div class='m-thumb' role='img' aria-label='Capa do módulo " + esc(m.titulo) + "' style=\"background-image:url('" + thumb(mi) + "')\"><span class='thumb-num'>M" + (mi + 1) + "</span><span class='m-tit'>" + esc(m.titulo) + "</span></div>" +
        "<div class='m-bar'><i style='width:" + pct + "%'></i></div>" +
        "<div class='m-info'><span>" + ok + "/" + tot + " aulas · " + pct + "%</span><button class='btn-mini' type='button'>" + (ok === tot ? "Rever" : "Ver aulas") + "</button></div>";
      d.onclick = () => abrirModulo(mi);
      abreComTeclado(d, () => abrirModulo(mi));
      homeModulos.appendChild(d);
    });

    grade.innerHTML = "";
    dados.modulos.forEach((m, mi) => {
      const tot = m.secoes.length;
      const ok = m.secoes.filter((s) => getF().includes(s.id)).length;
      const pct = Math.round((ok / tot) * 100);
      const d = document.createElement("div");
      d.className = "mod-card";
      d.innerHTML = "<div class='m-thumb' role='img' aria-label='Capa do módulo " + esc(m.titulo) + "' style=\"background-image:url('" + thumb(mi) + "')\"><span class='thumb-num'>M" + (mi + 1) + "</span><span class='m-tit'>" + esc(m.titulo) + "</span></div>" +
        "<div class='m-bar'><i style='width:" + pct + "%'></i></div>" +
        "<ul>" + m.secoes.map((s) => {
          const g = lista.findIndex((x) => x.id === s.id);
          const done = getF().includes(s.id);
          return "<li data-g='" + g + "'><span>" + (done ? "✓ " : "") + esc(s.titulo) + "</span><b>" + (done ? "ok" : "→") + "</b></li>";
        }).join("") + "</ul>";
      const head = document.createElement("div");
      head.style.cssText = "padding:10px 14px 0;color:var(--muted);font-size:.78rem";
      head.textContent = ok + "/" + tot + " aulas · " + pct + "% · clique na capa p/ checklist";
      d.insertBefore(head, d.querySelector("ul"));
      const capa = d.querySelector(".m-thumb");
      capa.style.cursor = "pointer";
      capa.onclick = () => abrirModulo(mi);
      abreComTeclado(capa, () => abrirModulo(mi));
      grade.appendChild(d);
    });
    grade.querySelectorAll("li").forEach((li) => {
      li.onclick = () => abrir(parseInt(li.dataset.g, 10));
      abreComTeclado(li, () => abrir(parseInt(li.dataset.g, 10)));
    });
  }

  // fontes por módulo (só links reais já usados no treinamento)
  const FONTES_MOD = {
    2: [
      { n: "SWE-bench Verified", u: "https://llm-stats.com/benchmarks/swe-bench-verified" },
      { n: "swebench.com", u: "https://www.swebench.com/" },
      { n: "Artificial Analysis", u: "https://artificialanalysis.ai/" }
    ],
    3: [{ n: "OpenRouter", u: "https://openrouter.ai/" }],
    4: [{ n: "Artigo Antigravity", u: "https://github.com/pathbit/pathbit-ai-for-devs/blob/master/0001_antigravity_acesso_total_irrestrito/article/ARTICLE.md" }],
    5: [{ n: "Artigo Claude Gravity", u: "https://github.com/pathbit/pathbit-ai-for-devs/blob/master/0002_claude_gravity_utilizando_9router/article/ARTICLE.md" }],
    6: [{ n: "Solicitar licença", u: "https://docs.google.com/forms/d/e/1FAIpQLSfxVz_0F4T8WCwz3cqNYs-cT-1ggRY9-Nrz379tBoJ1S85K3w/viewform" }],
    7: [{ n: "Newsletter Path Insights", u: "https://www.linkedin.com/newsletters/path-insights-7265451057395224578/" }]
  };

  function mostrarHero(visivel) {
    $("hero").style.display = visivel ? "" : "none";
    const p = document.querySelector(".progresso");
    if (p) p.style.display = visivel ? "" : "none";
  }

  // checklist de um módulo: progresso + aulas com checkbox
  function abrirModulo(mi) {
    const m = dados.modulos[mi];
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("ativo"));
    syncTabs("");
    ["view-inicio", "view-modulos", "view-aula", "view-anotacoes", "view-fontes", "view-modulo"].forEach((v) => $(v).classList.add("hidden"));
    $("view-modulo").classList.remove("hidden");
    mostrarHero(false);
    window._mi = mi;
    const tot = m.secoes.length;
    const ok = m.secoes.filter((s) => getF().includes(s.id)).length;
    const pct = Math.round((ok / tot) * 100);
    const det = $("moduloDetalhe");
    det.innerHTML = "<button class='btn ghost' id='btnVoltarMod' type='button'>← Todos os módulos</button>" +
      "<div class='mod-head'><img src='" + thumb(mi) + "' alt=''><div style='flex:1;min-width:220px'><div class='trilha'>Módulo " + (mi + 1) + "/" + dados.modulos.length + "</div><h2>" + esc(m.titulo) + "</h2><div class='muted'>" + ok + "/" + tot + " aulas · " + pct + "%</div><div class='m-bar'><i style='width:" + pct + "%'></i></div></div></div>" +
      "<div class='check-lista'>" + m.secoes.map((s) => {
        const g = lista.findIndex((x) => x.id === s.id);
        const done = getF().includes(s.id);
        return "<label class='check-item" + (done ? " ok" : "") + "'><input type='checkbox' data-g='" + g + "'" + (done ? " checked" : "") + "><span><strong>" + esc(s.titulo) + "</strong><small>" + resumo(s.corpo) + "</small></span><button class='btn-mini' data-ler='" + g + "' type='button'>Ler →</button></label>";
      }).join("") + "</div>";
    $("btnVoltarMod").onclick = () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("ativo", t.dataset.view === "inicio"));
      syncTabs("inicio");
      ["view-modulo"].forEach((v) => $(v).classList.add("hidden"));
      $("view-inicio").classList.remove("hidden");
      mostrarHero(true);
    };
    det.querySelectorAll("input[type=checkbox]").forEach((cb) => cb.onchange = () => {
      const g = parseInt(cb.dataset.g, 10);
      let f = getF();
      const id = lista[g].id;
      f = cb.checked ? [...f, id] : f.filter((x) => x !== id);
      setF([...new Set(f)]);
      prog(); render(busca.value); abrirModulo(mi);
    });
    det.querySelectorAll("[data-ler]").forEach((b) => b.onclick = (e) => { e.preventDefault(); abrir(parseInt(b.dataset.ler, 10)); });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrir(g) {
    mostrarHero(false);
    g = Math.max(0, Math.min(lista.length - 1, g));
    localStorage.setItem(LAST, String(g));
    const s = lista[g];
    const feito = getF().includes(s.id);
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("ativo", t.dataset.view === "aula"));
    syncTabs("aula");
    ["view-inicio", "view-modulos", "view-anotacoes", "view-fontes", "view-modulo"].forEach((v) => $(v).classList.add("hidden"));
    $("view-aula").classList.remove("hidden");
    const primeiraDoModulo = dados.modulos[s.mi].secoes[0].id === s.id;
    const figura = primeiraDoModulo ? "<figure class='aula-fig'><img src='" + imgDe(s) + "' alt='slide " + esc(s.mod) + "' loading='lazy'><figcaption>Imagem original · " + esc(s.mod) + "</figcaption></figure>" : "";
    const links = (s.corpo.match(/https?:\/\/[^\s<]+/g) || []).filter((v, i, a) => a.indexOf(v) === i);
    const botaoCompleto = links.length ? "<a class='btn play btn-completo' href='" + links[0] + "' target='_blank' rel='noopener'>Conferir conteúdo completo →</a>" : "";
    const extras = links.length > 1 ? "<div class='links-extras'>" + links.slice(1).map((u) => "<a href='" + u + "' target='_blank' rel='noopener'>link relacionado</a>").join(" · ") + "</div>" : "";
    const fontes = (FONTES_MOD[s.mi] || []).filter((f) => !links.includes(f.u));
    const chips = fontes.length ? "<div class='aula-fontes'><span>Fontes:</span> " + fontes.map((f) => "<a href='" + f.u + "' target='_blank' rel='noopener'>" + esc(f.n) + "</a>").join(" · ") + "</div>" : "";
    conteudo.innerHTML = "<div class='trilha'>" + esc(s.mod) + " · aula " + (g + 1) + "/" + lista.length + " · ~5 min</div><h2>" + esc(s.titulo) + "</h2>" +
      figura +
      "<div class='aula-corpo" + (primeiraDoModulo ? "" : " foco") + "'><div class='aula-resumo'>O que você vai entender aqui</div><div>" + md(s.corpo) + "</div>" + botaoCompleto + extras + chips + "</div>" +
      "<div class='aula-notas'><div class='aula-resumo'>Anotações desta aula</div><textarea id='notaAulaTexto' rows='2' placeholder='Anote enquanto estuda…'></textarea><div class='nota-acoes'><span class='muted'>Visível só aqui + na aba Anotações</span><button id='btnNotaAula' class='btn secundario' type='button'>Salvar anotação</button></div><div id='listaNotasAula' class='notas'></div></div>";
    const bf = $("btnFeito");
    bf.textContent = feito ? "Concluída ✓ (desmarcar)" : "Marcar concluída ✓";
    bf.classList.toggle("feito", feito);
    $("btnAnt").disabled = g === 0;
    $("btnProx").disabled = g === lista.length - 1;
    window._aula = g;
    window._mi = s.mi;
    renderNotasAula(g);
    const bn = $("btnNotaAula");
    if (bn) bn.onclick = () => {
      const t = $("notaAulaTexto").value.trim();
      if (!t) return;
      const arr = getN();
      arr.push({ id: Date.now(), texto: t, aula: s.mod + " — " + s.titulo, aulaId: s.id, quando: new Date().toLocaleString("pt-BR") });
      setN(arr);
      renderNotasAula(g);
      renderNotas();
    };
    const nc = $("notaContexto");
    if (nc) nc.textContent = "Anotando em: " + s.mod + " — " + s.titulo;
    window.scrollTo({ top: 0, behavior: "smooth" });
    prog();
  }

  document.querySelectorAll(".tab").forEach((t) => t.onclick = () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.remove("ativo"));
    t.classList.add("ativo");
    syncTabs(t.dataset.view);
    ["view-inicio", "view-modulos", "view-aula", "view-anotacoes", "view-fontes", "view-modulo"].forEach((v) => $(v).classList.add("hidden"));
    $("view-" + t.dataset.view).classList.remove("hidden");
    mostrarHero(t.dataset.view === "inicio");
  });
  // links do footer que navegam entre abas
  document.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => {
    const t = document.querySelector('.tab[data-view="' + b.dataset.go + '"]');
    if (t) t.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const topo = document.querySelector(".topo");
  const aoScrollar = () => topo.classList.toggle("scrollado", window.scrollY > 24);
  window.addEventListener("scroll", aoScrollar, { passive: true });
  aoScrollar();
  // anotações (localStorage)
  const NKEY = "treinamento-notas-v1";
  const getN = () => { try { return JSON.parse(localStorage.getItem(NKEY) || "[]"); } catch { return []; } };
  const setN = (v) => localStorage.setItem(NKEY, JSON.stringify(v));
  function renderNotasAula(g) {
    const box = $("listaNotasAula");
    if (!box) return;
    const id = lista[g].id;
    const ns = getN().filter((n) => n.aulaId === id);
    box.innerHTML = ns.length ? "" : "<p class='muted'>Nenhuma anotação nesta aula ainda.</p>";
    ns.slice().reverse().forEach((n) => {
      const d = document.createElement("div");
      d.className = "nota";
      d.innerHTML = "<small>" + esc(n.quando) + "</small><p>" + esc(n.texto) + "</p><button type='button'>Excluir</button>";
      d.querySelector("button").onclick = () => { setN(getN().filter((x) => x.id !== n.id)); renderNotasAula(g); renderNotas(); };
      box.appendChild(d);
    });
  }
  function renderNotas() {
    const listaN = getN();
    $("notasCount").textContent = listaN.length;
    const box = $("listaNotas");
    box.innerHTML = "";
    if (!listaN.length) box.innerHTML = "<p class='muted'>Nenhuma anotação ainda. Escreva acima e salve.</p>";
    listaN.slice().reverse().forEach((n) => {
      const g = n.aulaId ? lista.findIndex((x) => x.id === n.aulaId) : -1;
      const d = document.createElement("div");
      d.className = "nota";
      d.innerHTML = "<small>" + esc(n.quando) + "</small>" +
        (n.aula ? "<div class='nota-origem'>📍 " + esc(n.aula) + "</div>" : "<div class='nota-origem solta'>📍 sem aula vinculada</div>") +
        "<p>" + esc(n.texto) + "</p><div class='nota-acoes'>" +
        (g >= 0 ? "<button type='button' data-abrir='" + g + "'>Abrir aula →</button>" : "") +
        "<button type='button' data-del='" + n.id + "'>Excluir</button></div>";
      const btnDel = d.querySelector("[data-del]");
      if (btnDel) btnDel.onclick = () => { setN(getN().filter((x) => x.id !== n.id)); renderNotas(); };
      const btnAbrir = d.querySelector("[data-abrir]");
      if (btnAbrir) btnAbrir.onclick = () => abrir(parseInt(btnAbrir.dataset.abrir, 10));
      box.appendChild(d);
    });
  }
  $("btnNota").onclick = () => {
    const t = $("notaTexto").value.trim();
    if (!t) return;
    const s = typeof window._aula === "number" && lista[window._aula] ? lista[window._aula] : null;
    const arr = getN();
    arr.push({ id: Date.now(), texto: t, aula: s ? s.mod + " — " + s.titulo : "", aulaId: s ? s.id : null, quando: new Date().toLocaleString("pt-BR") });
    setN(arr);
    $("notaTexto").value = "";
    renderNotas();
  };
  renderNotas();
  document.querySelectorAll(".setas button").forEach((b) => b.onclick = () => {
    const el = $(b.dataset.alvo);
    if (el) el.scrollBy({ left: parseInt(b.dataset.dir, 10) * 640, behavior: "smooth" });
  });
  $("btnPlay").onclick = () => {
    const f = getF();
    const nxt = lista.findIndex((s) => !f.includes(s.id));
    abrir(nxt === -1 ? 0 : nxt);
  };
  $("btnAnt").onclick = () => abrir((window._aula || 0) - 1);
  $("btnProx").onclick = () => abrir((window._aula || 0) + 1);
  $("btnModulo").onclick = () => abrirModulo(window._mi || 0);
  $("btnFeito").onclick = () => {
    const g = window._aula || 0;
    let f = getF();
    const id = lista[g].id;
    f = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
    setF([...new Set(f)]);
    abrir(g); render(busca.value);
  };
  $("btnCheck").onclick = () => { const f = getF(); alert(f.length + " de " + lista.length + " (" + Math.round((f.length / lista.length) * 100) + "%)"); };
  $("btnReset").onclick = () => { if (confirm("Zerar progresso?")) { setF([]); localStorage.setItem(LAST, "0"); render(""); } };
  busca.oninput = () => render(busca.value);
  busca.onkeydown = (e) => { if (e.key === "Enter") { const primeiro = document.querySelector(".card-net"); if (primeiro) primeiro.click(); } };

  setTimeout(() => render(""), 700);
})();
