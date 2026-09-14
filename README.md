# agente-treinamento

Agente de instalação + instruções unificadas em ambiente de treinamento.
Nasceu dos slides `pathbit_evolucao_agentes_ia.pdf` (Google Drive) para não ficar cansativo: tudo vira módulos curtos navegáveis.

## Estrutura

- `agente.js` — CLI de instalação/checagem (roda com `node agente.js --help`)
- `server.js` — serve `treinamento/` em `http://localhost:3000` sem dependência
- `treinamento/` — ambiente web unificado (módulos, progresso, busca)
- `scripts/unificar.js` — junta `slides/*.txt` em `instrucoes/UNIFICADO.md` + `treinamento/modulos.json`
- `instrucoes/UNIFICADO.md` — instrução única gerada
- `slides/` — coloque aqui o PDF original + o texto extraído

## Rodar

```powershell
Set-Location "C:\Users\Pedro Oliveira\pathbit\manager\projetos\agente-instalacao-treinamento"
node agente.js --check
npm start
# abrir http://localhost:3000
```

## Unificar os slides (passo real, sem stub)

1. Baixe o PDF do Drive: https://drive.google.com/file/d/1JvyxlJ34qRERnUP1KxevwuW2BaAZ-tfX/view
2. Salve como `slides/slides.pdf` nesta pasta
3. Extraia o texto (abra o PDF, Ctrl+A / Ctrl+C) e salve como `slides/conteudo.txt`
   - Um arquivo `.txt` por bloco de slides também vale: `slides/01-intro.txt`, `slides/02-instalacao.txt`...
4. Rode:
```powershell
node scripts/unificar.js
```
5. Saída: `instrucoes/UNIFICADO.md` + `treinamento/modulos.json` recarregados no browser.

Sem `slides/*.txt` o projeto roda com o conteúdo base de exemplo (3 módulos).

## Comandos do agente

```powershell
node agente.js --help
node agente.js --check
node agente.js --install
node agente.js --treinar
```
