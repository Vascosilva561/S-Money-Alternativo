# Design QA

## Source visual truth

- Current task source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-c94103b9-52ec-458b-99c5-565ec08d9152.png`
- Current task state: Gestão de Utilizadores, desktop, Empresas selected, with Email, Nome, NIF, location, status and action columns visible.
- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-07c5b4e6-df9b-43aa-9cbd-8a7be147b928.png`
- Secondary source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-6d3ae3d6-ed0a-442c-82a8-50dc2114f7f1.png`
- Additional sources: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-8deb5ef3-f863-4cd8-8544-05055c0e987c.png`, `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-88cb150f-cde0-4a54-baac-b9a7aef5ec17.png`
- Source state: Gestão de Utilizadores, desktop, focused references for the left-aligned action header, system tooltips, single search clear control, and action-column edge spacing.
- Source pixels: 1636 x 817 px; treated as a 1x desktop content-region reference with no density normalization.

## Implementation evidence

- URL: `http://localhost:5173/gestao-de-utilizadores`
- Browser: Chrome user tab, 1920 x 855 CSS px, devicePixelRatio 1.
- Capture: final browser screenshot captured after Vite HMR; the CUA capture is available in the task transcript (the browser tool does not expose a filesystem screenshot path).
- State: Gestão de Utilizadores with the Particulares tab selected, the user table loaded, and the polished content area visible.
- Latest capture: same authenticated Chrome tab at 1920 x 855 CSS px, devicePixelRatio 1, with Empresas selected. The current CUA capture is available in the task transcript; computed header widths were Email 215px, Nome 246px, NIF 138px, Nacionalidade 138px, Província 138px, Município 138px, Nível 108px, Estado da Conta 154px, Situação 138px and Ações 123px.
- Console check: the filter dialog now exposes `Filtrar Dados` as its accessible title; no new dialog-title warning was observed after the final reload and filter interaction. Historical SVG-property warnings from other existing components remain outside this refinement.
- Additional route checks: `/gestao-de-agentes`, `/saldo-por-usuario`, `/pagamentos`, `/historico-de-relatorios`, and `/bancos` all show their page title and `Dashboard > ...` route in the top bar. The same mapping now covers the existing Gestão, Operações, Relatórios, Controle, and Administração/Configurações page headers.

## Comparison

- Full-view evidence: the section title and breadcrumb moved from the content region into the 80px top bar; the tabs and table shifted upward, preserving the existing visual language and sidebar/header controls.
- Focused region evidence: the toolbar and content table were compared against the annotated source; the search field shares the action row, has `box-shadow: none`, the filter is icon-only, the table frame has a 24px visual gutter, the count-to-table gap measures 12px, and the row-action controls measure 36 x 36 CSS px.
- Fonts and typography: retained the existing Inter-based hierarchy, with the shared title and breadcrumb reduced by 15% as requested.
- Spacing and layout rhythm: preserved the existing 80px header and content padding while removing the redundant vertical heading block.
- Colors and visual tokens: retained `#143163` for primary text and `#17CFDA` for the route separator; replaced the raw `>` character with the Lucide `ChevronRight` icon.
- Image quality and asset fidelity: the supplied level badge SVGs remain reused as real assets; the action icons remain the existing Lucide controls.
- Copy and content: preserved the existing labels, tabs, filters, search behavior, pagination, and row actions.
- Content-area polish: kept the existing structure while placing the search field on the toolbar row, removing its shadow, reducing `Filtrar` to an icon-only control, adding 24px table gutters, setting square row-action buttons, and enforcing a 12px gap between the record count and table.

## Comparison history

- Initial implementation: title/route rendered in the shared top bar; repeated direction blocks were removed from every page that used one of the five section-header components.
- Post-fix evidence: browser capture shows the requested title/route in the top bar and the content beginning directly with the tabs.
- Follow-up polish: the title and route are 15% smaller, and the route separator is now a directional chevron icon.
- Content-area iteration: tabs now have a clearer active state, the toolbar is more compact and ordered, the search bar has stronger focus/clear states, and the table uses consistent padding, row rhythm, header treatment, and action affordances.
- Toolbar/table refinement: the search and actions now share one desktop row; the table is inset by 24px, the count-to-table gap is 12px, and row action controls are explicit 36px square buttons.
- Column-distribution refinement: the Empresas column tracks now sum to 100%; Email was reduced from 20% to 14%, Nome increased to 16%, and the remaining columns were balanced while keeping the action track at 8% with its 120px minimum.

## Current iteration

- Search: the input uses `type="text"`, removing the browser-native search cancel affordance; the interface keeps one custom accessible `Limpar pesquisa` control.
- Action spacing: the action column uses `pr-5` (20px) and right-aligns its button group; browser measurement at 1920 x 855 CSS px confirms exactly 20px between the last action button and the table edge.
- Header alignment: the `Ações` label now uses the same 80px alignment track as the two-button group and is left-aligned to the first icon without changing the 20px outer breathing room.
- Action controls: both row actions remain square at 36 x 36 CSS px with an 8px gap.
- Action tooltips: the eye and edit actions now use the shared Radix tooltip component with “Ver detalhes” and “Editar utilizador” labels; native `title` tooltips were removed to avoid duplicate behavior.
- Copy controls: each row now places a compact copy icon to the right of the Telefone, Nome, and Bilhete de Identidade values; each control exposes an accessible label and triggers the existing `Copiar!` toast.
- Level badges: the Nível column maps 1/2/3 to the provided Bronze, Prata, and Ouro SVG assets, rendering each as `badge + nome` with a fixed 20 x 20 CSS px icon.
- Verification: `/gestao-de-utilizadores` was reloaded and visually checked after the change; `npm run build` completed successfully.

## Findings

- No actionable P0, P1, or P2 visual differences remain for the requested content-area refinement.
- The current Empresas screenshot shows the Email column no longer absorbing excess space after the label/value, with the adjacent Nome and NIF tracks visibly closer and balanced.
- Existing repository-wide lint failures are unrelated to this change; the production build completed successfully.

## Primary interactions tested

- Loaded `/gestao-de-utilizadores` and verified the header metadata and table render.
- Navigated to `/gestao-de-agentes` and `/saldo-por-usuario` and verified their header metadata.
- Navigated to `/pagamentos`, `/historico-de-relatorios`, and `/bancos` and verified the Operações, Relatórios, and Administração/Configurações headers.
- Confirmed the remaining direction components are no longer rendered from page code; their route metadata is centralized in the shared header.
- Switched between `Particulares` and `Empresas` and verified the table headers update correctly.
- Filled the search field, verified the filtered state and clear-search button, then restored the complete list.
- Opened the icon-only filter control and verified the existing filter dialog, then returned to the list.
- Focused the edit action and verified the shared system tooltip appears with the “Editar utilizador” label; both action buttons expose accessible names.
- Returned to `/gestao-de-utilizadores` for handoff.

## Current task: Histórico de Relatórios

### Source visual truth

- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-651116c7-2a89-4cd4-9cb2-9554c08c8e07.png`
- Source state: Relatórios > Históricos de Relatórios, desktop, Gestão de Contas selected, report list with download actions visible.
- Source pixels: 1915 x 909 px; treated as a 1x desktop reference.

### Implementation evidence

- URL: `http://localhost:5173/historico-de-relatorios`
- Intended viewport: desktop, 1920 x 909 CSS px, devicePixelRatio 1.
- Implementation screenshot path: unavailable; the authenticated preview session expired and redirected to `/login` before the post-change capture.
- State: implementation was not visually capturable without a new login.

### Comparison

- Full-view comparison: blocked because the rendered implementation could not be captured in the same authenticated state.
- Focused region comparison: blocked for the same reason; the source list was opened and inspected, but no post-change implementation image is available.
- Fonts and typography: implementation retains the existing Inter-based hierarchy and uses semibold report names; visual comparison remains pending.
- Spacing and layout rhythm: implementation adds consistent row height, 12px row gaps, responsive content padding, and a separated pagination area; visual comparison remains pending.
- Colors and visual tokens: implementation reuses the existing navy, blue, and pale-blue design tokens; visual comparison remains pending.
- Image quality and asset fidelity: the implementation uses the existing Lucide `FileText` and `Download` icons; no custom raster asset was introduced.
- Copy and content: existing tab labels, report titles, `Baixar` action, empty state, and pagination behavior were preserved.

### Findings

- [Blocked] Final visual verification could not be completed because the authenticated browser session expired. No source-vs-rendered P0/P1/P2 comparison was claimed.
- Build verification passed with `npm run build`; targeted lint passed for `src/pages/historicosDeRelatorios.tsx`.

### Comparison history

- Current iteration: redesigned report rows with file icons, stronger hierarchy, consistent download buttons, hover/focus states, loading/empty states, and pagination separation. Post-fix screenshot is pending re-authentication.

final result: blocked

## Current task: Meu Perfil — hierarquia e consistência visual

### Source visual truth

- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-3b1c34a1-628f-4d51-8ee7-2eed280754c7.png`
- Source state: Meu Perfil, desktop, tab “Editar Perfil” ativa, dados carregados e campos em modo de leitura.
- Source pixels: 1917 x 913 px; tratado como referência desktop 1x.

### Implementation evidence

- URL: `http://localhost:4173/perfil`
- Browser: Chrome user tab authenticated, 1920 x 855 CSS px, devicePixelRatio 1.
- Capture: screenshot final capturada no navegador com a tela no estado “Editar Perfil”; a ferramenta CUA exibe a evidência no transcript, mas não expõe um caminho de ficheiro local para a imagem.
- Additional capture: base dos cartões verificada após scroll, com o cartão de identidade e o painel de edição terminando no mesmo eixo horizontal.

### Normalization and comparison

- A comparação foi feita no conteúdo da aplicação, excluindo diferenças de scroll da sidebar e a diferença de altura disponível do viewport (913 px na referência vs. 855 px no browser).
- Full-view evidence: o cartão de identidade e o editor começam alinhados; a tab ativa conecta-se ao painel; ambos os blocos usam a mesma borda externa suave e fecham alinhados no rodapé.
- Focused region evidence: tabs/painel, separadores da lista de informações, barra de ações e estado da tab de palavra-passe foram verificados em capturas separadas.

### Required fidelity surfaces

- Fonts and typography: mantida a família/hierarquia existente; títulos e labels continuam navy, com labels compactos e valores secundários em cinza azulado.
- Spacing and layout rhythm: substituído o fluxo flexível por grid responsivo; gap de 16px entre blocos; tabs e painel compartilham o mesmo eixo; linhas de informação usam padding uniforme.
- Colors and visual tokens: cartões e tabs usam `#D7E2F2` a 1px; active tab mantém o acento `#48B9FF` a 4px; divisores internos usam `#E7EDF5`/`#EDF2F7`; ações usam o tratamento azul-claro já presente no produto.
- Image quality and asset fidelity: logo, ícones, avatar e fallback de avatar existentes foram preservados; o estado sem foto deixou de renderizar uma imagem quebrada e usa o mesmo avatar de fallback do cartão.
- Copy and content: labels, valores, tabs e fluxo de edição/troca de palavra-passe foram preservados.

### Comparison history

- Initial post-layout capture: a faixa de transição encolheu e mostrou as duas forms lado a lado dentro da tab de perfil.
- Fix: a faixa voltou a ter `flex-basis: 200%` sem shrink e cada form passou a ocupar 50% da faixa.
- Post-fix evidence: a tab ativa mostra somente a sua form; a tab de palavra-passe mostra somente o campo de palavra-passe e o botão de ação.
- Final polish: botões de ação foram alinhados ao padrão de 40px/8px, separadores foram suavizados, o fallback do avatar foi normalizado e os dois blocos foram equalizados por stretch do grid.

### Findings

- No actionable P0, P1, or P2 visual differences remain for this refinement.
- P3/follow-up only: the supplied reference captures a different sidebar scroll position and a taller viewport; these do not affect the profile content comparison.
- The production build completed successfully. Repository-wide lint remains blocked by 385 pre-existing errors across unrelated files; the changed profile file retains only its pre-existing `any` warnings.

### Primary interactions tested

- Loaded `/perfil` in the authenticated browser and verified the populated profile screen.
- Switched between “Editar Perfil” and “Alterar Palavra-passe”; only the selected form is visible.
- Opened the personal-data edit state and verified Cancelar/Salvar, editable fields, avatar fallback and camera affordance.
- Scrolled to the bottom and verified both panels terminate on the same horizontal line.

final result: passed

## Current task: Ritmo do label no editor de perfil

### Source visual truth

- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-d3ca5556-5217-4538-88a4-ece3ddebedcb.png`
- Review point: o editor de perfil precisava de 8px reais entre cada label e o controlo, sem depender dos utilitários `space-y-2`/`mt-6`.

### Implementation evidence

- Target: `.ui-profile-form` em `src/pages/meuPerfil.tsx`.
- O contrato final força labels a 14px/20px/600, `row-gap: 8px` e `margin-top: 14px` nos wrappers `.ui-profile-field`.
- As linhas de dois campos usam grid com 16px entre colunas e os filhos seguem o mesmo wrapper, incluindo selects e os campos de palavra-passe.
- `npm run build` passou após a alteração; `git diff --check` não encontrou erros de whitespace.

### Findings

- A regra anterior dependia de margens Tailwind e podia ser vencida em campos legados do perfil. A nova regra é específica, explícita e tem precedência sobre esses utilitários.
- Não foram alterados dados, rotas ou comportamento de edição; apenas o contrato visual e o espaçamento dos campos.

final result: passed

## Current task: Estados e ritmo final dos inputs

### Source visual truth

- Sources: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-d9dcea10-2011-4a38-afac-313f807097c0.png` and `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-fa60965c-5e91-4492-a379-524009f2fcfc.png`
- Review points: estados hover/pressed/preenchido/erro/sucesso/desativado, 14px entre campos, 8px entre label e controlo, calendários clicáveis e ação “Validar” embutida.

### Implementation evidence

- URL: `http://localhost:5173/campanhas`
- Browser: Chrome user tab, painel “Criar campanha” aberto.
- Visual capture: labels com 14px/20px/600; controlos com 40px de altura, raio 8px, chevron consistente e calendário nativo visível; o “Validar” aparece como retângulo interno de 64x32px, raio 6px, com 4px de respiro à borda.
- Browser measurement: label → controlo = 8px em todos os campos medidos; wrappers consecutivos do formulário = 14px; colunas = 16px.
- Date interaction: ambos os `input[type=date]` expõem o botão nativo “Mostrar selecionador de data” na árvore acessível; o clique no campo e no ícone mantém o input focado, sem bloquear o picker nativo.
- Build: `npm run build` passou; `git diff --check` não encontrou erros de whitespace.

### Findings

- Os estados partilhados agora cobrem hover, pressed/open, focus-visible, filled, erro, sucesso, readonly e disabled para inputs, textareas, selects nativos e triggers Radix.
- O antigo indicador decorativo que podia interceptar o calendário foi removido; a affordance nativa permanece visível e clicável.
- Os botões de validação das campanhas, criação de conta e transferência usam o mesmo padrão interno e deixam espaço reservado dentro do input.
- No preview não foram observados P0, P1 ou P2 visuais nesta revisão.

### Primary interactions tested

- Recarregado o preview das campanhas e verificado o modal com campos simples, textarea, pares de datas, números e validação inline.
- Confirmados estados computados do botão “Validar”, incluindo fundo, borda, raio e posicionamento interno.
- Confirmado o foco após clique no campo e no ícone do calendário.

final result: passed

## Current task: Modal form rhythm and select unification

### Source visual truth

- Sources: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-01991d45-446e-41db-81a3-ad000dd0d411.png`, `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-4a6fe196-cb8e-4b8b-8e51-9a45dc89ed84.png`, `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-3496cc52-2d0d-4a35-8e43-3beff9baadf1.png`
- Review focus: labels and controls with collapsed vertical rhythm, plus native and Radix selects rendering with different arrows/padding.

### Implementation evidence

- URL: `http://localhost:5173/gestao-de-utilizadores`
- Browser: authenticated Chrome user tab, 1920 x 855 CSS px.
- Filter and edit sheets were opened after HMR and checked visually.
- Browser measurements: labels are 14px/20px/600; controls are 40px high with an 8px label-to-control gap, 14px row rhythm, and 16px column gap. Native and Radix selects share the same 40px height, 8px radius, 12px left padding, and muted 16px chevron treatment.

### Findings

- No actionable P0, P1, or P2 differences remain in the reviewed modal states.
- Two-column legacy rows now own their 14px vertical separation; child fields no longer collapse into the previous or next row.
- Native selects, Radix SelectTrigger and country dropdown use the same select contract. Date inputs also use the shared calendar icon treatment.
- `npm run build` passed; `git diff --check` returned no whitespace errors.

### Primary interactions tested

- Opened the utilizers filter sheet and verified empty placeholders, two-column spacing, select arrows and date icons.
- Opened the user edit sheet, scrolled through the form and verified the phone/date and province/municipality rows.
- Closed both sheets and restored the route to the users list.

final result: passed

## Current task: uniformização global de labels, espaçamento e placeholders

### Source visual truth

- Sources: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-3d29c896-a639-45ca-b6b7-c58d33d1d015.png` and `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-b7ec491c-e02b-4a73-bcc1-9b44ca7cf6d2.png`.
- Source states: filtro de utilizadores vazio e edição de utilizador backoffice preenchida.
- Source pixels: 604 x 651 px and 829 x 571 px, treated as 1x references.

### Implementation evidence

- Local preview: `http://localhost:4174/login`, in-app browser, 748 x 900 CSS px, devicePixelRatio 1.
- The authenticated sheets from the source could not be opened without credentials; no authentication bypass was performed.
- The unauthenticated implementation capture confirms the shared empty-input placeholder and focus treatment: `Digite o email` and `Palavra-passe`, with the same 40px field height and focus ring.
- `npm run build` passed after the final changes.

### Findings and comparison

- [Blocked] Full source-vs-rendered comparison of the two authenticated panels remains blocked by the missing session.
- The implementation now owns label typography (14px/20px/600), label-to-control gap (8px), field rhythm (14px), column gap (16px), control height (40px), and shared select styling through the sheet/dialog contract.
- Legacy empty inputs receive localized placeholders through `FormNormalizer`; explicit placeholders remain untouched. Native empty selects receive `Selecione...`; Radix selects preserve their declared `Todos`/`Selecione...` placeholder.
- The shared `Input`, Radix `SelectTrigger`, native selects and country dropdown use the same border, radius, focus, disabled and placeholder tokens.

### Primary interactions tested

- Reloaded the local preview after HMR.
- Verified empty Email and Password placeholders visually.
- Verified the existing app build and browser console after the change.

final result: blocked

## Current task: Sistema unificado de campos de formulário

### Source visual truth

- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-e28db35d-70f0-4b24-b55f-32cd10fa1ca5.png`
- Source state: painel “Editar utilizador”, desktop, com select, textarea, campos de texto, data e selects nativos.
- Source pixels: 664 x 900 px; referência 1x.

### Implementation evidence

- Route opened: `http://localhost:4174/login`, 748 x 900 CSS px in the in-app browser.
- Capture: a evidência renderizada está no transcript; a ferramenta de browser não expõe ficheiro local da captura.
- Visual state tested: input de Email vazio e em foco. O controlo apresenta borda azul, halo de foco de 4px e mantém o label com contraste suficiente.
- Build: `npm run build` passou após as alterações.
- Console: apenas o aviso já existente de `clip-path`/`clipPath`; não foram encontrados erros introduzidos pelos novos campos.

### Comparison

- Full-view comparison: bloqueada. A rota de edição exige sessão autenticada e o browser local redireciona para Login; não foi efetuado bypass de autenticação.
- Focused region: os controlos de Login confirmam a aplicação do estado global de foco, mas não substituem uma comparação visual do painel autenticado da referência.
- Fonts and typography: os novos campos usam Inter, labels a 14px/600 e mensagens auxiliares a 12px.
- Spacing and layout rhythm: o contrato usa 8px entre label e controlo, altura mínima de 40px, raio de 8px e adornos a 12px.
- Colors and visual tokens: normal `#C9D8E9`, foco `#48B9FF`, erro `#D94343`, sucesso `#16865B` e desativado `#F5F7FA`.
- Image quality and asset fidelity: não foram introduzidos assets rasterizados; os ícones usam a biblioteca Lucide já instalada.
- Copy and content: labels e regras de dados existentes foram preservados.

### Findings

- [Blocked] A validação visual 1:1 do painel “Editar utilizador” depende de uma sessão autenticada. A implementação não a pôde capturar sem credenciais.
- Os estados default, hover, focus, erro, sucesso e desativado estão implementados no contrato partilhado; erro e sucesso precisam ser exercitados pelo fluxo de validação autenticado.

### Primary interactions tested

- Carregado o Login no preview local.
- Focado o campo Email e verificado visualmente o estado de foco.
- Executado `npm run build` com sucesso.

final result: blocked

## Current task: Meu Perfil — compactação e alinhamento de campos

### Source visual truth

- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-d61a046b-1508-4169-8e0c-ffdbb344ffc1.png`
- Source state: Meu Perfil, desktop, tab “Editar Perfil” ativa, dados carregados e campos em modo de leitura.
- Review annotations: os retângulos vermelhos da imagem foram tratados como marcações de revisão e não como elementos a reproduzir na interface.
- Source pixels: 1917 x 913 px; tratado como referência desktop 1x.

### Implementation evidence

- URL: `http://localhost:4173/perfil`
- Browser: Chrome user tab authenticated, 1920 x 855 CSS px, devicePixelRatio 1.
- Capture: estados padrão, palavra-passe e edição verificados no mesmo preview; a ferramenta CUA exibe as capturas no transcript, mas não expõe um caminho de ficheiro local.

### Normalization and comparison

- A lista de informações pessoais foi compactada para linhas com padding uniforme de 8px e divisores internos suaves, reduzindo a sensação de excesso de espaço sem perder a leitura dos valores.
- Tabs e painel agora seguem o padrão das demais telas: borda compartilhada, canto superior esquerdo flush, linha de continuidade após a faixa de tabs e active tab sem linha duplicada.
- Campos em linhas duplas usam um grid único com gap horizontal de 16px; os espaçamentos verticais dos campos foram normalizados para 16px.
- O cartão de identidade e o painel continuam alinhados pelo mesmo stretch do grid e encerram no mesmo eixo inferior no estado de leitura.
- Medição no browser: as linhas pessoais ficaram com 39px de altura uniforme; os pares de campos ficaram em duas colunas de 374px com 16px entre elas; a faixa de tabs mede 360px e termina exatamente no início da linha de continuidade do painel.

### Findings

- No actionable P0, P1, or P2 visual differences remain for this refinement.
- O lint direcionado mantém apenas os 5 `no-explicit-any` preexistentes em `src/pages/meuPerfil.tsx`; não foram introduzidos novos erros de lint.
- `npm run build` completou com sucesso; o aviso de chunk grande já existente não bloqueia a entrega.

### Primary interactions tested

- Recarregada a rota `/perfil` e verificada a tela com dados carregados.
- Alternadas as tabs “Editar Perfil” e “Alterar Palavra-passe”, confirmando a transição e a exibição exclusiva do formulário selecionado.
- Aberto e cancelado o estado de edição, confirmando a consistência do espaçamento dos inputs e dos botões.
- Confirmada a preservação da altura/alinhamento dos dois blocos e da borda compartilhada entre tabs e painel.

final result: passed

## Current task: Meu Perfil — tab de palavra-passe sem quebra

### Source visual truth

- Source: `C:\Users\Vasco\AppData\Local\Temp\codex-clipboard-d61a046b-1508-4169-8e0c-ffdbb344ffc1.png`
- Annotation: o label “Alterar Palavra-passe” deve permanecer numa única linha.

### Implementation evidence

- URL: `http://localhost:4173/perfil`
- Browser: Chrome user tab authenticated, 1920 x 855 CSS px, devicePixelRatio 1.
- Browser measurement: ambas as tabs ficaram com 178px x 44px; a tab de palavra-passe usa `white-space: nowrap`, sem overflow vertical.

### Findings

- No actionable P0, P1, or P2 visual differences remain for this refinement.
- A largura total da faixa permanece em 360px e a união visual com o painel foi preservada.

### Primary interactions tested

- Recarregado o preview de `/perfil` após HMR.
- Confirmada visualmente a tab “Alterar Palavra-passe” em uma única linha.

final result: passed
