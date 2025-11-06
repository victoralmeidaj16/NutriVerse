# NutriVerse — Guia de Produto & Design (v1)

> **Missão**: ajudar as pessoas a comerem melhor todos os dias, com prazer e autonomia. **NutriVerse** mantém o *branding* e personalidade da marca, incorporando o motor de trocas inteligentes e demais funcionalidades do **FitSwap** (IA + visão computacional), sempre com foco em saúde, clareza e engajamento responsável.

---

## 1) Branding

### Nome e posicionamento
- **Marca**: **NutriVerse** — “O universo da sua saúde e alimentação”.
- **Proposta**: superapp que orienta, planeja e ajuda a executar boas escolhas, com **IA de trocas** que *fitza* qualquer receita preservando o sabor.

### Identidade visual
- **Paleta** (Dark-first):
  - **Primária (Energia/Saúde)**: **Verde limão** `#9BE000`  
  - **Secundárias (Tecnologia/Confiança)**: **Roxo suave** `#6A4AF0` e **Azul petróleo** `#0F3D3E`
  - **Neutros**: **BG carvão** `#0B0B0D`, **Card** `#16161B`, **Texto** `#FFFFFF`, **Sub** `#A5A7B0`, **Borda** `#2A2A30`
- **Tipografia**: Títulos **Poppins** (ou SF Display), texto **Inter** — legibilidade alta em dark.
- **Ícones/Ilustrações**: traços arredondados, minimalistas, amigáveis; ênfase em ingredientes e utensílios.
- **Tom de voz**: direto, motivador, descomplicado — “**Você no controle da sua saúde**”.
- **Motion**: microinterações suaves (200–300ms), *glow* sutil em chamadas primárias.

### Uso de marca
- Ícone do app: logotipo “N” orbital com acento verde limão.  
- Restrições: manter contraste AA/AAA; evitar saturação excessiva do verde em grandes áreas.

---

## 2) Conceito de Produto
**NutriVerse** é um **superapp** fitness de alimentação que combina:
- **Personalização por objetivos** (hipertrofia, perda de peso, saúde geral).
- **Controle nutricional com IA**: registro por voz/foto/busca, leitura de rótulos, visão de pratos e despensa.
- **Planejamento automático de refeições** e **lista de compras** integrada.
- **Comunidade** para desafios, trocas populares e compartilhamento de receitas.
- **Gamificação** ética (pontos, conquistas, níveis) e **integração** com Apple Health/Google Fit/Garmin.

**Diferencial**: Visual *à la* Tasty (+ prazer), personalização Yummly (+ relevância), controle tipo MyFitnessPal (+ disciplina) e social tipo Strava (+ motivação) **com o motor FitSwap de trocas inteligentes**.

---

## 3) Funcionalidades (core + FitSwap)

### 3.1 Motor de Trocas Inteligentes (FitSwap)
- Entrada: link/texto/foto de uma receita ou ingredientes disponíveis.
- Saída: versões **Original / Lean / High‑Protein / Budget** com **impacto transparente**:
  - **Macros** (kcal, proteínas, carboidratos, gorduras), **sódio**, **fibras** (quando disponível) e **R$/porção**.
- Parametrização por **objetivos**, **restrições** (alergias/intolerâncias), **tempo** e **orçamento** definido pelo usuário.
- **Explicabilidade**: por que a troca é melhor (menos açúcar/sódio, mais fibra/proteína, custo menor), com linguagem simples.

### 3.2 Perfil & Metas Nutricionais
- Cálculo de **TDEE** e metas **diárias/semanais**.
- Ajuste automático de **porções** para bater metas; sugestão de distribuição por refeição.

### 3.3 Score de Saúde e Score de Custo
- Escala 0–100 por receita.
- Critérios: densidade nutricional, equilíbrio de macros, sódio, açúcares adicionados, *ultra‑processados*, custo/porção.

### 3.4 Modo Despensa
- Marcar itens manualmente **ou** enviar **foto** da geladeira/armário.
- IA reconhece ingredientes e **sugere receitas com swaps** usando somente o que há em casa.

### 3.5 Passo‑a‑passo com Timer
- Modo cozinha com temporizadores por etapa, **conversões** (xícaras ↔ gramas) e ajuste de porções.
- **Trocas populares da comunidade** (ex.: “creme de leite → iogurte grego + azeite”), com votos e comentários.

### 3.6 Registro Rápido
- **Voz**, **foto do prato/dispensa** ou **busca por nome**.
- Feedback instantâneo (microanimações + som leve opcional) para consolidar hábito.

---

## 4) Arquitetura de Navegação

### Abas (bottom bar — 4 principais)
1. **Início** — Feed inteligente (Receita do dia com swaps; Dica rápida; Desafio da semana).  
2. **Planejar** — Calendário semanal/mensal com metas e auto‑preenchimento por IA.  
3. **Registrar** — Ações rápidas: Escanear / Foto / Voz / Buscar / Receitas salvas.  
4. **Comunidade** — Desafios, trocas populares, ranking e compartilhamento.

### Menu lateral
- Perfil (progresso, pontos, badges), Preferências (objetivos, restrições), Histórico/Relatórios.

### Padrões de UX
- Primeira sessão com **uma decisão** (“Vamos começar”) para evitar fadiga; metas em linguagem natural.
- **Acessibilidade**: alvos grandes, contraste alto, *Dynamic Type*; *dark mode* padrão.

---

## 5) Fluxos Recomendados

### 5.1 Onboarding → Perfil & Metas
1. Perguntas rápidas (objetivo, restrições, orçamento/porção, tempo médio para cozinhar).  
2. Cálculo TDEE → metas diárias com preview do **círculo de progresso**.
3. Importar dados (Apple Health/Google Fit) opcional.

### 5.2 “Fitzar” uma receita (link/texto/foto)
1. Usuário cola link / cola texto / envia foto.  
2. IA extrai ingredientes/etapas e **propõe trocas**.  
3. UI mostra *tabs* **Original/Lean/High‑Protein/Budget** com **ImpactRow** (kcal, P/C/G, sódio, R$/porção).  
4. CTA: **Cozinhar agora**, **Adicionar ao plano**, **Lista de compras**.

### 5.3 Modo Despensa
1. Foto ou seleção de itens.  
2. IA retorna 3–5 ideias *fitzadas* (ordenadas por tempo, proteína e custo).  
3. Salvar plano da semana em 1 toque.

### 5.4 Registro rápido
- **Voz**: “comi 150g de frango + arroz” → parser → ajuste de porção → salvar.
- **Foto**: reconhecimento do prato → sugerir porções/trocas → salvar.
- **Buscar por nome**: autocomplete inteligente → item → porção → salvar.

---

## 6) Componentes & Padrões de UI (RN)
- **MacroRing** (SVG), **CategoryChip**, **SectionHeader**, **ScorePill**.
- **RecipeCard** com **SwapTabs** e **ImpactRow**.
- **TipCard**, **ChallengeCard**, **BottomTabs** com FAB “Registrar”.
- **SearchBar** e **QuickActions** (Foto da despensa, Foto do prato, Falar, Buscar).  
- **StepTimer** (modo cozinha).

> **Obs.:** A implementação de referência (Expo/React Native) está na lousa como *UI Kit Base*. Manter o **branding NutriVerse** (verde limão, roxo, petróleo) na camada de tema.

---

## 7) Integrações de IA e Visão (contratos pro MVP)

### 7.1 Endpoints mock (camada de serviço)
```ts
// fitSwapTransform: transforma receita em variações com impacto
POST /ai/fitSwapTransform
Body: { input: { type: 'url'|'text'|'photo', value: string|Binary }, goals: { mode:'loss|gain|health', kcal?:number }, restrictions: string[], budgetPerServing?: number, time?: number }
Resp: {
  source: ParsedRecipe,
  versions: Array<{
    key: 'original'|'lean'|'protein'|'budget',
    macros: { kcal:number, p:number, c:number, g:number, sodium?:number, fiber?:number },
    costPerServing?: number,
    explanation: string[], // por que as trocas são melhores
    steps?: Step[]
  }>
}

// parsePantry: visão de itens da despensa/geladeira
POST /ai/parsePantry
Body: { image: Binary }
Resp: { items: Array<{ name:string, qty?:string, confidence:number }> }

// scanBarcode: consulta alimento por código
```

### 7.2 Mapeamento de UI → Serviços
- **SearchBar**: `fitSwapTransform(input)` quando o usuário cola um link/texto.
- **QuickActions**: `parsePantry` / `fitSwapTransform(photo)` / STT→`fitSwapTransform(text)`.
- **RecipeCard**: renderiza `versions` como *tabs*.

---

## 8) Métricas e Telemetria (evento → props)
- `app_open`  
- `onboard_complete` { goal, kcalTarget, restrictionsCount }  
- `fitzar_submit` { type, hasPhoto, parseMs }  
- `fitzar_version_view` { key: original|lean|protein|budget }  
- `add_to_plan` { source: recipe|fitzar|pantry }  
- `register_meal` { method: voice|photo|search }  
- `challenge_join` { id, sponsor }  
- `premium_trial_start` / `premium_convert`

---

## 9) Monetização
- **Premium** R$ / US$ 9,90/mês ou 99/ano: fitzar avançado, planejamento automático, relatórios, aulas, integrações completas.
- **Marketplace**: ingredientes a partir da receita (carrinho por porção), produtos fitness e suplementos.
- **B2B**: academias, nutricionistas, *creators* com *dashboards*.
- **Desafios patrocinados** (ex.: “Semana da Proteína”).

---

## 10) Acessibilidade & Ética de Engajamento
- Alvos confortáveis, contraste alto, suportar *Dynamic Type* e *VoiceOver*.
- Recompensas variáveis para descoberta **com pontos de parada** (sem *infinite scroll*).
- Notificações **acionáveis** e graduais (evitar spam).

---

## 11) Roadmap de MVP (8–12 semanas)
1) **Núcleo**: Onboarding → Perfil/Metas → Registrar (voz/foto/busca) → **Fitzar v1** → Card com impacto.  
2) **Planejar**: semana com auto‑preenchimento + lista de compras.  
3) **Comunidade v1**: publicar receita + trocas populares (votos/comentários).  
4) **Relatórios**: Score Saúde/Custo, progresso semanal.  
5) **Integrações**: Apple Health/Google Fit.  
6) **Marketplace piloto**.

---

## 12) Critérios de Aceite (MVP)
- Dado um **link de receita**, quando o usuário *fitzar*, então são exibidas pelo menos 3 versões com impacto visível (kcal, P/C/G) e CTA para plano/lista.

- Dada uma **foto de despensa**, quando enviada, então ao menos 3 receitas compatíveis são sugeridas.
- **Acessibilidade**: contraste AA e foco visível.

---

## 13) Casos Limite
- Receita incompleta/ambígua → pedir confirmação dos ingredientes.
- Alergias críticas (amendoim, glúten, lactose) → alerta e trocas seguras prioritárias.
- Sem conexão → fila local de ações e *retry* exponencial.

---

## 14) Plano de Testes (adicionar suites)
- **Unidade**: parser de receita (texto), cálculo de impacto, normalização de porções.  
- **Integração**: `fitSwapTransform` com *tabs* e `ImpactRow`.  
- **E2E**: fluxo Onboarding→Fitzar→Plano→Registro.

### Checklists visuais (manual)
- Cores/contraste em **Dark**.  
- Estados: *loading*, erro, vazio, offline.

---

## 15) Perguntas em aberto
1. Critérios exatos para **Score de Saúde** (ponderadores de sódio, fibra, açúcar adicionado).  
2. Escopo de **marcas/parceiros** para Marketplace no lançamento.  
3. Política de **moderação** para trocas populares (spam, receitas perigosas).  
4. Regras de **notificações** por perfil (frequência e horário quiet hours).  

---

### Anexo: Mapa de Navegação (detalhado)
```
App Shell
│
├─ Onboarding
│   ├─ Objetivos (perder peso / ganhar massa / saúde)
│   ├─ Restrições (alergias/intolerâncias)
│   ├─ Orçamento por porção & Tempo disponível
│   └─ Conectar Apple Health/Google Fit (opcional)
│
├─ Bottom Tabs
│   ├─ Início
│   │   ├─ Header (saudação + metas restantes)
│   │   ├─ SearchBar (colar link/texto) + QuickActions (Foto despensa/prato, Falar, Buscar)
│   │   ├─ Macro Rings (kcal/prot/carb/gord)
│   │   ├─ Receita do dia → RecipeDetail
│   │   │   ├─ Swaps (Original/Lean/Protein/Budget)
│   │   │   ├─ ImpactRow (kcal, P/C/G, sódio, R$/porção, fibra)
│   │   │   ├─ Score Saúde & Custo
│   │   │   ├─ Modo Mão Livre (leitura + timers)
│   │   │   └─ Passo-a-passo com Timer & Conversões (xícara↔g)
│   │   ├─ Dica rápida
│   │   ├─ Desafio da semana (pode ser patrocinado)
│   │   └─ Reels de receitas rápidas
│   │
│   ├─ Planejar
│   │   ├─ Calendário semanal/mensal (café/alm/lanche/jantar)
│   │   ├─ Auto-preenchimento por IA a partir de metas
│   │   ├─ Ajuste de porções para bater metas
│   │   ├─ Lista de compras gerada por período
│   │   └─ Exportar/Compartilhar lista
│   │
│   ├─ Registrar
│   │   ├─ Voz → parsing natural → item/porção
│   │   ├─ Foto do prato → visão → item/porção
│   │   ├─ Buscar por nome → autocomplete
│   │   └─ Receitas salvas → registrar direto
│   │
│   └─ Comunidade
│       ├─ Feed de receitas e swaps populares (votos/comentários)
│       ├─ Desafios (ranking local/global)
│       └─ Perfil público básico (bio, badges, conquistas)
│
├─ Modo Despensa
│   ├─ Foto da geladeira/armário → IA reconhece itens
│   ├─ Lista editável de ingredientes detectados
│   └─ Sugestões de 3–5 receitas ordenadas por tempo, proteína e custo
│
├─ Fitzar Receita (Modal/Screen)
│   ├─ Input: link/texto/foto
│   ├─ Parser de ingredientes & etapas
│   ├─ Abas: Original | Lean | High-Protein | Budget
│   ├─ Impacto (kcal, P/C/G, sódio, fibra) + R$/porção
│   ├─ Explicabilidade (por que cada troca)
│   └─ CTAs: Cozinhar / Adicionar ao plano / Lista de compras
│
├─ Perfil
│   ├─ Metas & TDEE
│   ├─ Preferências (objetivos, restrições, orçamento, tempo)
│   ├─ Histórico & Relatórios (semanal/mensal)
│   ├─ Badges, pontos, níveis
│   └─ Integrações (Health/Google Fit/Garmin)
│
├─ Marketplace (opcional MVP)
│   ├─ Carrinho por receita/período
│   └─ Parceiros/lojas
│
├─ Notificações
│   ├─ Centro de notificações
│   └─ Preferências (silenciosas, resumo diário)
│
└─ Paywall & Premium
    ├─ Trial, benefícios premium
    └─ Upgrade/gestão de assinatura
```

**Cobertura de funcionalidades conferida:**
- Motor de trocas (Fitzar) com impacto nutricional e custo ✓
- Perfil & Metas (TDEE, metas diárias/semanais, ajuste de porções) ✓
- Scores de Saúde e de Custo por receita ✓
- Modo Despensa com foto e sugestões restritas ao que há em casa ✓
- Passo-a-passo com Timer, conversões e **Modo Mão Livre** ✓
- Trocas populares com votos/comentários ✓
- Planejamento semanal + lista de compras ✓
- Registro rápido por **voz/foto/busca** (sem escanear código) ✓
- Comunidade (desafios, ranking local/global) ✓
- Gamificação (pontos, badges, níveis) ✓
- Integrações com wearables/apps fitness ✓
- Dark mode e acessibilidade ✓

