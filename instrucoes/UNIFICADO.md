# Instruções unificadas — agente-instalacao-treinamento

_Origem: 01-linha-do-tempo.txt, 02-fronteira-2026.txt, 03-benchmarks.txt, 04-economia-inferencia.txt, 05-antigravity-poc1.txt, 06-claudegravity-resiliencia.txt, 07-operacao-comunidade.txt, 08-path-insights.txt | Gerado em 2026-09-14T17:12:33.112Z_

## Módulo 1 — 01 linha do tempo

_Fonte: 01-linha-do-tempo.txt_

### Visão geral

Neste módulo você vai aprender a tese do treinamento: os 3 estágios da evolução (texto → contexto → ambiente), por que RAG e memória superaram o prompt perfeito, o que é o harness e o loop planejar → executar → validar → commitar que rege todas as PoCs.

### A tese em uma frase

A evolução dos agentes vai do prompt ao harness: três estágios, um gargalo cada — o texto que escrevemos, o contexto que damos ao modelo e o ambiente onde ele executa.
Pense assim: primeiro o gargalo era escrever bem (prompt), depois passou a ser alimentar bem (contexto) e hoje é operar bem (ambiente). Quem entende essa tese entende por que este treinamento existe: ele opera na terceira camada, a que realmente transforma modelo em engenheiro.

### 2022 prompts

Few-shot, CoT (chain-of-thought), roles. O gargalo era o texto: o prompt perfeito.
Na época, o jogo era dar exemplos (few-shot), pedir raciocínio passo a passo (CoT) e definir papéis (roles como "você é um senior"). Funcionava para tarefas curtas, mas quebrava em trabalho real: bastava a conversa alongar para o modelo perder o fio. A lição que fica: prompt bom é necessário, mas nunca foi suficiente.

### 2024 contexto

RAG, memória, tools. De 2023 a 2025 a pergunta virou "o que entra na janela?". RAG, memória e tool use passaram a valer mais que o prompt perfeito.
A pilha da janela ficou assim: system prompt -> memória da sessão -> RAG com documentos do repo -> tool use com saída de comandos. Tudo isso dentro de janelas de até 1M de tokens.
Na prática: quem monta bem o contexto (repo indexado, memória persistente, ferramentas ligadas) extrai muito mais do mesmo modelo do que quem só capricha no prompt.

### O gargalo da sessão

Contexto morria na sessão: trabalho real exige execução longa, paralela e auditável. O gargalo migrou para a infra ao redor do modelo.
Sessões de chat somem, não rodam em paralelo e não deixam rastro auditável. Código real precisa do oposto: rodar por horas, tentar vários caminhos ao mesmo tempo e registrar cada decisão. É por isso que o gargalo saiu do texto e foi para a infraestrutura — permissões, orquestração, logs, retries. Essa infra tem nome: harness.

### 2025 harness

Frameworks, fallback. Em 2025+ o diferencial é o ambiente ao redor do modelo: permissões, ferramentas, orquestração e resiliência de inferência.
O harness é a camada que transforma modelo em engenheiro de verdade. Nossos conteúdos operam exatamente nesta camada.
Ou seja: o modelo sugere, mas é o harness que deixa ele ler o repo, rodar comandos, validar com testes, commitar e — se a cota estourar — trocar de provedor sem derrubar a sessão. Dominar essa camada é o objetivo das PoCs deste treinamento.

### O loop do agente

PLANEJAR -> EXECUTAR -> VALIDAR -> COMMIT, com retorno "se quebrou, refaz o plano". Tags: permissões, ferramentas, fallback multi-provedor.
Esse é o batimento cardíaco de todo agente sério: ele planeja a tarefa, executa com as ferramentas liberadas, valida o resultado (testes, lint, build) e só então commita. Se qualquer etapa quebrar, ele volta ao plano em vez de insistir no erro. Guarde esse loop — as PoCs 1, 2 e 3 são ele rodando na prática, cada uma numa camada: autonomia, inferência e resiliência.

## Módulo 2 — 02 fronteira 2026

_Fonte: 02-fronteira-2026.txt_

### Visão geral

Neste módulo você vai aprender o que é a fronteira de modelos em 2026: os 6 labs do pelotão, a arquitetura em dois papéis (elite como motor, abertos como rede de segurança) e por que operar em cascata multi-modelo em vez de casar com um modelo.

### O que é fronteira

Fronteira é o pelotão dos modelos mais avançados, dos grandes labs: Anthropic, OpenAI, Google, Z.ai, Alibaba e Moonshot.
Não-fronteira: abertos e locais (GPT-OSS, Qwen, Ollama) são a rede de segurança, não o motor.
Na prática: fronteira no topo da cascata, abertos no piso.
A ideia central é simples: existe um grupo de elite (a fronteira) que puxa a qualidade máxima, e existe a base aberta/local que garante que você nunca fica parado. Um sem o outro é arriscado — só elite quebra no custo e na cota, só base perde qualidade. O treinamento inteiro assume essa divisão.

### Dois papéis, uma arquitetura

MODELOS DE FRONTEIRA (motor principal): Claude, GPT, Gemini, GLM, Qwen, Kimi (Anthropic, OpenAI, Google, Z.ai, Alibaba, Moonshot).
Cascata de fallback no meio.
ABERTOS E LOCAIS (rede de segurança): GPT-OSS 120B, Qwen Coder, Ollama.
Visualize uma cascata: a requisição entra pelo topo (o melhor modelo disponível no momento) e, se falhar — cota, 429, logout — ela desce de nível automaticamente até o piso local. O Ollama no seu PC é o último degrau: lento perto da elite, mas sempre disponível e de graça. As PoCs 2 e 3 montam exatamente essa cascata.

### A fronteira 2026

Seis fornecedores no topo, capacidades equivalentes na prática, e a liderança trocando de mãos a cada trimestre.
No topo hoje: claude anthropic, gpt openai, gemini google, glm z.ai, qwen alibaba, kimi moonshot.
Moral: não casar com um modelo — treino é multi-modelo.
Isso muda tudo na hora de estudar e operar: em vez de decorar um modelo, aprenda a operar a cascata. Os benchmarks do próximo módulo provam o ponto — a diferença no topo é pequena e o que decide é caso de uso e custo, não marca.

## Módulo 3 — 03 benchmarks

_Fonte: 03-benchmarks.txt_

### Visão geral

Neste módulo você vai aprender a ler benchmarks sem autoengano: SWE-bench Verified, os 3 gráficos da Artificial Analysis (score, custo, índice) e os leaderboards da LLM-stats — e a decidir pelo caso de uso, não pelo ranking.

### SWE-bench Verified

Claude lidera, mas o pelotão a ~80% é global: Google, DeepSeek, Alibaba e Moonshot empatados dentro de 0,4 ponto.
SET/2026: 95% no topo, 80,2 a 80,6% no pelotão: a diferença real está no caso de uso.
O que o benchmark mede: problemas reais do GitHub em repos Python open-source populares — o modelo lê o problema, entende a base e gera um patch funcional. É o padrão-ouro para agentes de código porque testa o ciclo completo, não só completar função.
Como ler sem se enganar: olhe o topo para saber o teto, olhe o pelotão para saber o custo-benefício, e decida pelo seu caso de uso. Fontes vivas: llm-stats.com e swebench.com (veja a aba Fontes).

### Artificial Analysis — score por benchmark

Gráficos de Score by Benchmark (posição média, quanto maior melhor) nas séries DeepSWE v1.1, Terminal-Bench 4.0 e SWE-Atlas-QnA, com 13 de 13 modelos. Todos os componentes usam resultado binário (passou/não passou).
O valor aqui é decompor o índice: um agente pode ser ótimo em terminal e médio em Q&A, e isso muda a escolha por tarefa. Dica de instrutor: apresente o gráfico como comparativo e mande a turma conferir os números exatos na fonte (artificialanalysis.ai), porque prints desatualizam rápido.

### Artificial Analysis — custo por tarefa

Gráfico Cost per Task (custo médio de API por tarefa em USD, quanto menor melhor): barras de ~US$ 0,24 até ~US$ 12,4, com intermediários na faixa de US$ 2 a 9. Variação maior que 50x entre agentes.
Essa é a lâmina econômica do treinamento: o agente mais capaz pode custar 50x mais por tarefa que um intermediário. É esse gap que justifica o ClaudeGravity (custo zero via cota) e o arsenal de fallback. Quando alguém perguntar "por que tanto esforço de gateway?", a resposta está neste gráfico.

### Artificial Analysis — índice x custo

Gráfico Coding Agent Index vs Cost per Task: eixo X custo por tarefa (US$ 0 a 14), eixo Y índice (~38 a 65). Legenda Most attractive quadrant e linha de Pareto. Provedores: Anthropic, OpenAI, Meta, Z.ai, Moonshot AI, SpaceXAI, Alibaba Cloud, DeepSeek, Google. Pontos: Codex, Claude Code, Muse Code/Muse Spark, Kimi CLI, Grok Build, Qwen, Gemini, DeepSeek, Antigravity.
Leitura prática: o quadrante mais atraente é alto índice a baixo custo — é ali que moram as combinações que este treinamento monta (fronteira via cota + fallback barato). Use este gráfico para ensinar trade-off: nunca escolha só pelo índice nem só pelo preço.

### Artificial Analysis — índice agregado

Incorpora 3 benchmarks (DeepSWE v1.1, Terminal-Bench 4.0, SWE-Atlas-QnA, quanto maior melhor): topo ~62 pontos (Claude Code Fable 5.1 e Codex GPT-6 Astra), depois 60, 55, 54, 54, 52, 47, 43, 43, 42.
Aviso importante: nomes de agentes e modelos mudam a cada trimestre — valide sempre na fonte antes de instruir a turma. O índice serve para ordenar o pelotão, não para decorar número: o que importa é quem está no topo hoje e quem entrega 90% disso por 10% do custo.

### LLM-stats coding e geral

Aba Coding: barras de ~700 a 2500 pontos, combinando arenas em tempo real com benchmarks de geração de código, depuração e engenharia de software.
Leaderboard 2026 GERAL: colunas Model U, LLM Stats, Reasoning, Coding, Agents, Context, Price $/M Tk, Speed e License, com ~20 linhas (GPT-5 Atlas, Claude Fable 5.1, GPT-5.6, Claude Mythos Preview, Claude Opus 5, Muse Spark 1.3, Claude Fable 5, Kimi K3, GLM, Qwen, DeepSeek).
Aba CODING: a mesma tabela com a coluna Coding em destaque.
Como usar em sala: tabela densa não se lê célula a célula — projete ao vivo, filtre por CODING e mostre como comparar contexto, preço e licença lado a lado. Fonte viva: llm-stats.com (Best AI for Coding 2026 e LLM Leaderboard 2026).

## Módulo 4 — 04 economia inferencia

_Fonte: 04-economia-inferencia.txt_

### Visão geral

Neste módulo você vai aprender a economia da inferência: comparar preço x performance no OpenRouter, o teto de custo por 1M de tokens (Claude x DeepSeek x ClaudeGravity zero) e por que "o melhor virou um pelotão".

### OpenRouter — preço x performance

Comparativo de 4 modelos (GPT Atlas Latest, Claude Fable 5.1, Gemini 3.8 Flash, Kimi K3). Blocos Pricing (Output, Cached input, Weighted Average, Cache Write, Web Search, Image/Audio input em US$/M tokens) e Performance (Latency p50, Throughput p50).
O que observar: não é só o preço do token de saída — input com cache, escrita de cache e latência p50 mudam a conta e a experiência. Um modelo barato com latência alta pode ser pior para agente interativo do que um médio e rápido.
Dica de sala: se for demonstrar, abra o OpenRouter ao vivo em vez do print — os preços mudam e a turma aprende a comparar sozinha. O print do slide é ilustrativo.

### Arenas e design

Em tarefas abertas a história se repete: Kimi K3 lidera o Design Arena com 1357 ELO, à frente de Claude Fable 5.1 com 1323.
DESIGN ARENA ELO: em design e texto criativo, todos os de fronteira entregam nível profissional.
Gráfico: Kimi K3 1357, Muse Spark 1.2 1325, Claude Fable 5.1 1323.
A leitura aqui é libertadora: para tarefas criativas e de design, qualquer modelo de fronteira já entrega nível profissional — então escolha pelo custo e pelo fluxo, não pela marca. Fontes: arena.ai e designarena.ai. Boa âncora para exercícios de design e texto criativo na turma.

### Custo por token

Inferência de ponta custa caro por token. Ou nada, dependendo da arquitetura.
TETO US$/1M TOKENS: Claude US$ 3 a 15, DeepSeek US$ 0,14 a 2,19, ClaudeGravity US$ 0 (cota AI Pro).
Gráfico: Claude nativo 15, DeepSeek API 2.19, ClaudeGravity 0.
Entenda a jogada: o ClaudeGravity troca token pago por cota da conta Google AI Pro — mesmo motor de harness (Claude Code), inferência via Gemini com 1M de contexto, custo extra zero. É a âncora econômica das PoCs 2 e 3 e o motivo pelo qual a licença Gemini (módulo 7) vale ouro.

### Use sempre o melhor

O melhor virou um pelotão. Frase-ponte para o hands-on: multi-modelo por padrão, decide no caso de uso e no custo.
Leve essa frase para o dia a dia: configure a cascata uma vez e deixe o gateway escolher o melhor disponível a cada chamada. A partir daqui o treinamento sai da teoria e entra nas 3 PoCs — autonomia, inferência e resiliência.

## Módulo 5 — 05 antigravity poc1

_Fonte: 05-antigravity-poc1.txt_

### Visão geral

Neste módulo você vai aprender autonomia com segurança: o motor de permissões do Agent 2.0 (deny > ask > allow), os 6 wildcards do modo irrestrito e o roteiro de 15 min da PoC 1 com reversão segura.

### Antigravity irrestrito

Parametrizamos o motor de permissões do Agent 2.0 (deny maior que ask maior que allow) com 6 wildcards: IDE, CLI e projetos, nos 3 sistemas.
Zero diálogos de confirmação: agentes com autonomia de execução total.
Conteúdo completo: github.com/pathbit/pathbit-ai-for-devs
O motor funciona em precedência: deny vence ask, ask vence allow. Com os 6 wildcards liberando IDE, CLI e pastas de projeto nos 3 sistemas, o agente para de pedir confirmação e passa a executar direto — é isso que "irrestrito" significa aqui.
Diagrama do slide: bloqueio -> Agent 2.0 -> decisão -> execução imediata.
Atenção de segurança: autonomia total exige backup e restore ensaiados antes de qualquer tarefa real. Nunca rode esse modo em máquina com dados sensíveis sem isolamento — use ambiente dedicado para a PoC.

### PoC 1 — antigravity (15 min)

Vamos destravar o Agent 2.0 ao vivo e rodar uma tarefa completa sem nenhuma confirmação manual.
O que vamos fazer: autonomia real com reversão segura — backup automático antes, um comando para voltar atrás.
O formato de 15 minutos é proposital: tempo suficiente para ver o agente trabalhar sozinho e curto o bastante para repetir. O ponto alto é o health_report marcando ALL_GRANTED — a prova visível de que as permissões estão todas liberadas antes da tarefa autônoma.

### Roteiro PoC 1

1. dry-run do setup de permissões
2. `verify_permissions.py`
3. health_report: ALL_GRANTED
4. apply + backup automático
5. tarefa autônoma no agy
6. `restore_permissions.py --latest`
Siga nesta ordem, sem pular o dry-run: ele mostra o que vai mudar antes de mudar. O backup automático é a rede de segurança — qualquer problema, um comando de restore volta tudo. Roteiro fiel ao slide, sem credenciais. Ao final, a turma deve saber repetir sozinha: verificar, aplicar, executar, reverter.

## Módulo 6 — 06 claudegravity resiliencia

_Fonte: 06-claudegravity-resiliencia.txt_

### Visão geral

Neste módulo você vai aprender resiliência de inferência: o ClaudeGravity (Claude Code + Gemini via 9Router, 1M de contexto, custo zero), o arsenal de fallback em cascata e os roteiros das PoCs 2 e 3.

### Claude Gravity

O harness do Claude Code com os Gemini da sua conta Google AI Pro, via gateway 9Router: protocolo, OAuth e RTK.
1 milhão de tokens de contexto, US$ 0 de inferência extra.
Conteúdo completo: github.com/pathbit/pathbit-ai-for-devs
Entenda a arquitetura: o Claude Code continua sendo o harness (planejar, executar, validar, commitar), mas a inferência passa a sair dos modelos Gemini da sua conta Google AI Pro, roteados pelo gateway 9Router. O ganho duplo é contexto gigante (1M) com custo extra zero, porque você usa cota em vez de token pago.
Diagrama do slide: roteamento de modelos Gemini e Claude via 9Router.
Atenção: exige conta Google AI Pro com OAuth configurado no gateway — sem inventar chaves, o passo a passo está no repositório e a licença se pede no módulo 7.

### PoC 2 — claudegravity (15 min)

Vamos subir o gateway 9Router, conectar a conta Google AI Pro e validar a ponte de ponta a ponta.
O que vamos fazer: Claude Code rodando em Gemini 3.8 com 1M de contexto, sem gastar token de API.
O momento mágico é o PONG do `test_gateway.py`: ele prova que a ponte está de pé antes de qualquer tarefa real. Depois disso, o combo claudegravity-fallback deixa a sessão resiliente desde o nascimento. É a PoC que transforma a economia do módulo 4 em realidade operacional.

### Roteiro PoC 2

1. `docker compose up -d`
2. `test_gateway.py` retorna PONG
3. combo claudegravity-fallback
4. OAuth antigravity no dashboard (manual no browser)
5. `claude --model ag/gemini-3.8-flash-high`
6. `keep_connected.py --daemon`
Detalhes que evitam tropeço: o OAuth é manual no dashboard (não dá para automatizar o login Google), e o daemon `keep_connected` mantém a sessão viva. Se o PONG não vier, pare aqui e diagnostique o gateway antes de seguir — não adianta subir o Claude em cima de ponte quebrada.

### Arsenal de fallback

9 fontes mapeadas, 5 integradas: Antigravity, OpenRouter, Groq, Mistral e Ollama local, em combos com cascata automática.
Cota estourou? O gateway salta de nível e a sessão não cai.
Pense no arsenal como andares de um prédio: o gateway tenta o andar de cima e, se a cota estourou ou o provedor falhou, desce sozinho para o próximo — a sessão continua de onde parou. Atenção ao vocabulário: 9 fontes foram mapeadas, mas 5 estão integradas de verdade; as demais são reserva mapeada, não ativa. O Ollama local é o térreo: sempre disponível como última barreira.

### PoC 3 — resiliência (15 min)

Vamos provocar falhas reais, 429 e logout, e provar que a sessão do Claude Code não cai.
O que vamos fazer: a cascata salta sozinha entre 5 provedores, e o Ollama local garante o piso.
Essa é a PoC mais divertida de apresentar: em vez de torcer para nada quebrar, você quebra de propósito e mostra a sessão sobrevivendo. O 429 simula cota estourada e o 401/logout simula credencial inválida — os dois casos reais que mais derrubam sessões em produção. Ver o salto automático acontecer ao vivo vende o conceito melhor que qualquer slide.

### Roteiro PoC 3

1. `setup_combos.py` (5 provedores)
2. `simulate_fallback.py` (429/401)
3. `claude --model arsenal-supremo`
4. `test_arsenal.py` nível a nível
5. salto de combo no dashboard
6. ollama como última barreira (precisa estar instalado local)
As falhas são simuladas de propósito — avise a turma antes para ninguém se assustar. Pré-requisito real: Ollama instalado e com um modelo baixado, senão o último degrau da cascata não existe. No fim, a turma deve saber diagnosticar nível a nível com o `test_arsenal.py` e forçar o salto de combo pelo dashboard.

## Módulo 7 — 07 operacao comunidade

_Fonte: 07-operacao-comunidade.txt_

### Visão geral

Neste módulo você vai aprender a operar com a comunidade: a iniciativa Path AI, onde aprofundar (repositório e fontes), a mensagem de fechamento e o passo a passo da licença Gemini em 2 etapas.

### Path AI

A iniciativa Pathbit para o ecossistema de IA: conteúdos abertos, POCs reais e ferramentas que evoluem com a comunidade. PATH IA FOR DEVS e TECH 2026.
Para a comunidade: esta sessão será gravada e publicada no YouTube da Pathbit, aberta a todos.
Assista no youtube pathbit. Tags: conteúdos, pocs, ferramentas.
O recado aqui é de ecossistema, não de produto: tudo que foi mostrado — permissões, gateway, combos — vive em repositório aberto e evolui com quem usa. E um aviso operacional: como a sessão é gravada e publicada, cheque o consentimento de gravação da turma antes de começar.

### Referências e fontes

Conteúdos, ferramentas e fontes desta sessão, tudo aberto e clicável.
Onde se aprofundar: todos os conteúdos da Pathbit estão no repositório, clona, roda e contribui.
Links e fontes: pathbit-ai-for-devs (todo o conteúdo), 9router, code.claude.com/docs, ollama.com, ai.google dev, antigravity.google, deepclaude, openrouter.ai, groq.com, mistral.ai, swebench.com, arena.ai, designarena.ai.
Use a aba Fontes deste treinamento como página viva: ela organiza os 9 links principais em 3 grupos (benchmarks, conteúdos passo a passo e licença) e abre tudo em nova aba. Para benchmarks que mudam todo trimestre, prefira sempre a fonte ao print congelado do slide.

### Encerramento

Modelos vão e vêm, a arquitetura fica.
Obrigado! Os conteúdos estão no repositório, clona, roda e vamos conversar.
Hashtag #FaleComAPath. Contatos: tecnologia@pathbit.com.br, www.pathbit.com.br
Essa frase de fechamento resume o treinamento inteiro: modelos são substituíveis, a arquitetura (harness, cascata, fallback) permanece. É o que justifica investir horas em permissões, gateway e resiliência em vez de decorar o modelo da moda. Deixe os contatos visíveis e convide para continuar a conversa no repositório.

### Sua licença gemini

Para acompanhar as POCs e usar os modelos de fronteira no dia a dia, solicite sua licença Google AI Pro (Gemini + Antigravity).
Passo 1 — criar conta Google com e-mail Pathbit: sites.google.com/pathbit.co/ajuda/google/criar-conta-google
Passo 2 — solicitar licença Gemini: logar no navegador com conta @pathbit.co ou @pathbit.com.br, abrir forms.gle/P8iBIdGEyyvwcUZS7 (QR no slide e na aba Fontes).
A licença cobre Gemini 3.x, Antigravity IDE e a CLI agy.
Detalhe que trava muita gente: o passo 2 só funciona logado com o e-mail @pathbit.co ou @pathbit.com.br no navegador — com conta pessoal o form não anda. Resolvida a licença, as PoCs 2 e 3 destravam: gateway com cota, 1M de contexto e custo zero de inferência extra.

## Módulo 8 — 08 path insights

_Fonte: 08-path-insights.txt_

### Visão geral

Neste módulo você vai aprender com a newsletter **Path Insights**: 8 artigos quinzenais da Pathbit — cada aula traz o resumo direto e o botão para o conteúdo completo no LinkedIn.

### Arquiteturas cognitivas do designer contemporâneo

- Publicado em **3 de jun. de 2026**
- **Resumo:** como os modelos **T-Shaped, Pi-Shaped e Comb-Shaped** estão redefinindo o mercado criativo — da crise do especialista vertical à polimatia aplicada das lideranças criativas, com guia prático para descobrir sua arquitetura.
- Link: https://pt.linkedin.com/pulse/arquiteturas-cognitivas-do-designer-contempor%C3%A2neo-pathbit-qvmof

### LLM Evals e Regressão

- Publicado em **6 de mai. de 2026** · continua o artigo de Prompt Engineering
- **Resumo:** comparar respostas é curto — o runner compara **3 candidatos completos** (Qwen genérico, Qwen estruturado, FLAN estruturado) com score ponderado por criticidade e **gate de release**: liderou com 1.357, mas 2 regressões críticas reprovaram o deploy.
- Link: https://pt.linkedin.com/pulse/llm-evals-na-pr%C3%A1tica-e-como-escolher-candidatos-detectar-regress%C3%A3o-fvp1f

### Design e IA — chega de evitar

- Publicado em **8 de abr. de 2026**
- **Resumo:** o medo diante de Figma AI, Claude Code, Lovable e Stitch é legítimo, mas paralisar não é opção — **roteiro em 5 passos** (experimentar, fundamentos, prompts, incorporar no fluxo, acompanhar mercado) + 3 perguntas que valem mais que curso.
- Link: https://pt.linkedin.com/pulse/design-ia-chega-de-evitar-%C3%A9-hora-aprender-e-usar-pathbit-d20cf

### Prompt engineering avançado

- Publicado em **18 de mar. de 2026**
- **Resumo:** laboratório **modelo x estratégia** com contrato de saída rígido em 3 linhas — Qwen few_shot **+80,2%**, FLAN checklist **+72,6%**: o ganho depende da combinação. Sequência: prompt → RAG → fine-tuning.
- Link: https://pt.linkedin.com/pulse/prompt-engineering-avan%C3%A7ado-como-medir-estrat%C3%A9gia-modelo-e-ganho-uagdf

### Todo programador deveria aprender System Design

- Publicado em **28 de jan. de 2026**
- **Resumo:** **80% dos problemas em produção são de arquitetura** — DNS, load balancer, scale up vs out, cache (latência ÷100x), SQL vs NoSQL, sharding, microsserviços, filas, CQRS e o caso WhatsApp.
- Link: https://pt.linkedin.com/pulse/todo-programador-deveria-aprender-system-design-pathbit-vlm5f

### Code review com IA

- Publicado em **9 de jan. de 2026**
- **Resumo:** revisão assistida virou mainstream — **87% menos tempo**, ROI de **400%** no ano 1 — com os 5 gargalos do manual, os 4 super-poderes da IA e análise de **8 ferramentas** (CodeRabbit, CodeGuru, Snyk, Kodus) com pricing e decisão.
- Link: https://pt.linkedin.com/pulse/revolu%C3%A7%C3%A3o-code-review-com-ia-pathbit-qiycf

### Git avançado para devs

- Publicado em **10 de dez. de 2025**
- **Resumo:** do "fix, fix2, final final" ao domínio — **stash** paralelo, **rebase interativo**, switch/restore, **reflog** como desfazer definitivo e cherry-pick cirúrgico, com regras de ouro e comandos para praticar.
- Link: https://www.linkedin.com/pulse/t%C3%A9cnicas-avan%C3%A7adas-git-para-devs-pathbit-5q0qe

### RAG ou Fine-Tuning

- Publicado em **26 de nov. de 2025**
- **Resumo:** a resposta errada **custa meses e milhares de dólares** — RAG (biblioteca viva, R$ 0–350/mês) vs fine-tuning (especialista treinado, R$ 2.600–17.000) vs híbrido, com exemplos e os **5 erros mortais**.
- Link: https://www.linkedin.com/pulse/rag-ou-fine-tuning-escolha-que-pode-salvar-afundar-seu-projeto-efbmf

---
Para regenerar: coloque .txt em slides/ e rode `node scripts/unificar.js`.