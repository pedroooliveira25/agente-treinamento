import sys
from pathlib import Path
from pypdf import PdfReader

base = Path(r"C:\Users\Pedro Oliveira\pathbit\manager\projetos\agente-instalacao-treinamento")
pdf = base / "slides" / "slides.pdf"
out = base / "slides" / "conteudo.txt"

reader = PdfReader(str(pdf))
print(f"paginas: {len(reader.pages)}")
partes = []
for i, page in enumerate(reader.pages, 1):
    try:
        t = page.extract_text() or ""
    except Exception as e:
        t = f"[erro extracao pag {i}: {e}]"
    t = t.strip()
    partes.append(f"\n\n===== PAGINA {i} =====\n{t}")
    print(f"pag {i}: {len(t)} chars")

texto = "\n".join(partes).strip()
out.write_text(texto, encoding="utf-8")
print(f"total chars: {len(texto)}")
print(f"salvo: {out}")
