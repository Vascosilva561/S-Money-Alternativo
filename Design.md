# Sómoney Backoffice — Especificação do design system

**Versão:** 2.2 · **Referência:** 22 de Outubro de 2026

**Âmbito:** interface web, navegação global/contextual, operações, administração e autenticação.

**Objectivo:** permitir que novas implementações reproduzam os padrões actuais com similaridade visual e funcional.

Este documento substitui a proposta 1.0. Resulta da leitura do código presente no workspace, incluindo alterações locais ainda não commitadas. Os intervalos das páginas de dados foram medidos no browser em 44 estados de tabela, nas páginas globais e contextuais, a 1920 px de largura. A validação desta versão confirma composição e espaçamento; não substitui uma auditoria completa de acessibilidade.

## Índice

1. [Aplicação e fontes de verdade](#1-aplicação-e-fontes-de-verdade)
2. [Cores e tokens](#2-cores-e-tokens)
3. [Tipografia](#3-tipografia)
4. [Dimensões e espaçamento](#4-dimensões-e-espaçamento)
5. [Shell e barra superior](#5-shell-e-barra-superior)
6. [Sidebar global e contextual](#6-sidebar-global-e-contextual)
7. [Organização das páginas](#7-organização-das-páginas)
8. [Tabs](#8-tabs)
9. [Botões e acções](#9-botões-e-acções)
10. [Inputs e formulários](#10-inputs-e-formulários)
11. [Selects, datas, selecção e uploads](#11-selects-datas-selecção-e-uploads)
12. [Tabelas, expansão e paginação](#12-tabelas-expansão-e-paginação)
13. [Estados, badges e iconografia](#13-estados-badges-e-iconografia)
14. [Modais e drawers por finalidade](#14-modais-e-drawers-por-finalidade)
15. [Cards, dashboard, perfil e autenticação](#15-cards-dashboard-perfil-e-autenticação)
16. [Feedback, responsividade e movimento](#16-feedback-responsividade-e-movimento)
17. [Conteúdo e acessibilidade](#17-conteúdo-e-acessibilidade)
18. [Receitas de implementação](#18-receitas-de-implementação)
19. [Inventário de componentes](#19-inventário-de-componentes)
20. [Excepções e limites](#20-excepções-e-limites)
21. [Aceitação e manutenção](#21-aceitação-e-manutenção)

## 1. Aplicação e fontes de verdade

### 1.1 Como interpretar as regras

| Classificação | Significado |
|---|---|
| Actual | Valor/comportamento identificado no código; referência para reprodução. |
| Regra de implementação | Orientação para funcionalidades novas; não garante que todo o legado já a cumpra. |
| Excepção / limite | Variante existente ou condição que exige confirmação no contexto final. |

Salvo indicação em contrário, dimensões são **CSS px**, cores referem-se ao **tema claro** e os pesos são pesos de fonte. Preservar os valores fraccionários da sidebar: não arredondar 43,2 px para 44 px nem 14,4 px para 14 px quando o objectivo é reproduzir essa navegação.

O sistema privilegia superfícies claras, texto azul-marinho, ciano como destaque, densidade controlada e acções compactas. A referência para listas é Gestão de Utilizadores; para detalhes, os sheets estruturados; para eliminação, `ConfirmDeleteDialog`.

### 1.2 Organização real

```text
src/index.css                    tokens, contratos globais e compatibilidade
src/components/ui/               primitivas e componentes partilhados
src/components/layout/           shell, navegação, header e títulos por rota
src/components/<domínio>/        formulários, filtros e detalhes específicos
src/components/utils/            apresentação de estados e formatação
src/assets/sidebarIcons/figma/    iconografia oficial da navegação
src/pages/                       composição, dados e interacções das páginas
src/hooks/                       dados e comportamentos reutilizados
```

Não assumir que existem `src/styles/tokens.css`, `components/patterns/DataTable.tsx` ou um `StatusBadge` genérico. Eram sugestões da proposta anterior; a implementação efectiva usa sobretudo CSS global, componentes UI e composições de domínio.

### 1.3 Precedência e consulta

1. Encontrar o componente da mesma família e finalidade.
2. Consultar a primitiva UI que ele utiliza.
3. Ler os selectores aplicáveis em `src/index.css`, incluindo os blocos posteriores e media queries.
4. Confirmar no browser o resultado final no mesmo viewport e estado da referência.

**A cascata faz parte do contrato:** há `!important`, selectores estruturais, `:has()` e correspondências de fragmentos de classes. Um `table-fixed` no JSX não garante layout fixo no resultado. Ordem dos botões, existência de `span` e posição dos wrappers também podem alterar a aparência.

O CSS usa `@import "tailwindcss"` e `@theme inline`. Existe também `tailwind.config.js`, mas esse ficheiro isolado não é o catálogo dos valores efectivos. Evitar introduzir configuração nova para reproduzir um estilo já presente.

| Fonte | Responsabilidade |
|---|---|
| [src/index.css](src/index.css) | Campos, tabelas, tabs, modais, acções, perfil, scroll e excepções |
| [layout.tsx](src/components/layout/layout.tsx) | Shell e espaçamento exterior |
| [Header.tsx](src/components/layout/Header.tsx), [pageHeaders.ts](src/components/layout/pageHeaders.ts) | Barra superior e nomes por rota |
| [AppSidebar.tsx](src/components/layout/AppSidebar.tsx), [sidebar.tsx](src/components/ui/sidebar.tsx) | Navegação, dimensões e persistência |
| [UserContextSidebar.tsx](src/components/layout/UserContextSidebar.tsx) | Navegação no contexto de uma conta |
| [gestao_contas.tsx](src/pages/gestao_contas.tsx) | Lista de referência |
| [form-field.tsx](src/components/ui/form-field.tsx) | Campos e estados partilhados |
| [sheet.tsx](src/components/ui/sheet.tsx), [dialog.tsx](src/components/ui/dialog.tsx) | Sobreposições e partes semânticas |
| [design-qa.md](design-qa.md) | Histórico de verificações anteriores; não substitui validação actual |

## 2. Cores e tokens

### 2.1 Paleta estrutural actual

| Papel | Valor | Utilização |
|---|---|---|
| Azul-marinho | `#143163` | Texto principal, navegação e CTA |
| Hover principal | `#1D467F` | Acções principais de listas e vários rodapés |
| Ciano de marca | `#17CFDA` | Destaques de navegação e interacção |
| Ciano suave | `#EAF6F8` | Item activo e botão secundário |
| Hover secundário | `#D8F4F5` | Acções secundárias da toolbar |
| Fundo da aplicação | `#F6F5FA` | Área principal autenticada |
| Superfície | `#FFFFFF` | Header, sidebar, cards, campos e modais |
| Contorno de superfície | `#D7E2F2` | Página de dados e dialog |
| Contorno secundário | `#ADCBD0` | Acções secundárias e elementos ciano |
| Divisória da shell | `#EBECEF` | Header e sidebar |
| Texto auxiliar | `#667085`, `#637590`, `#627089` | Descrições e metadados, conforme componente |
| Texto de navegação auxiliar | `#7D8CA6` | Grupos, perfil e subtítulos |
| Foco de campos | `#48B9FF` | Borda e halo |
| Overlay | `rgb(0 0 0 / 50%)` | Fundo de dialog e sheet |

Os nomes da primeira coluna são descritivos; não correspondem todos a variáveis CSS já existentes. Reutilizar a variável ou componente real em vez de presumir tokens novos.

### 2.2 Tokens reais de formulário

| Variável | Valor |
|---|---|
| `--field-text` | `#143163` |
| `--field-label` | `#102F63` |
| `--field-border` | `#C9D8E9` |
| `--field-placeholder` | `#8293AE` |
| `--field-focus` | `#48B9FF` |
| `--field-error` | `#D94343` |
| `--field-success` | `#16865B` |
| `--field-disabled` | `#F5F7FA` |
| `--field-label-size` / `--field-label-line` | `14px` / `20px` |
| `--field-label-control-gap` | `8px` |
| `--field-height` | `40px` |
| `--field-row-gap` / `--field-column-gap` | Base `14px` / `16px`; em modais `24px` / `24px`; detalhes têm excepção `14px` / `16px` |

O bloco final de espaçamento normaliza grupos com `.ui-field` em modais para **24 px**. Comentários anteriores que ainda referem 14/16 px não são a regra geral final desses grupos.

### 2.3 Tokens reais de tabela e estado

| Variável / tom | Fundo | Texto |
|---|---|---|
| `--table-header-bg` | `#F5F7FB` | `#143163` |
| `--table-row-alt-bg` | `#FBFCFE` | `#143163` |
| `--table-row-hover-bg` | `#F5F9FF` | `#143163` |
| `--table-border` / `--table-divider` | `#E5EBF4` / `#EEF2F7` | — |
| `--status-success-bg` / `--status-success-fg` | `#E5F5EA` | `#0A7A31` |
| `--status-warning-bg` / `--status-warning-fg` | `#FFF4CC` | `#8A5A00` |
| `--status-danger-bg` / `--status-danger-fg` | `#FDECEC` | `#B42318` |
| `--status-info-bg` / `--status-info-fg` | `#E6F0FF` | `#035AAA` |
| `--status-purple-bg` / `--status-purple-fg` | `#F3E8FF` | `#6941C6` |
| `--status-neutral-bg` / `--status-neutral-fg` | `#F2F4F7` | `#536176` |

O significado de um estado continua no domínio. Não declarar que todo “Inactivo” é cinzento: configurações GPO apresentam “Inactiva” com tratamento de perigo.

### 2.4 Tokens genéricos e tema

O `:root` também define `--primary`, `--background`, `--card`, `--muted`, `--ring`, `--chart-1` a `--chart-5` e `--radius`, com valores OKLCH. `--primary` é neutro escuro, não o navy da marca. Assim, `Button` sem variante/contexto não reproduz automaticamente o CTA do backoffice.

Sidebar clara: fundo branco; foreground/primary `#143163`; primary-foreground branco; accent `#EAF6F8`; border `#EBECEF`; ring `#17CFDA`.

**Limite:** existem tokens `.dark`, mas muitas superfícies usam cores claras explícitas. A existência dos tokens não comprova um tema escuro completo. Esta especificação tem como referência o tema claro.

## 3. Tipografia

**Fonte principal:** Inter, fallback `sans-serif`, aplicada ao `body`. Inter e Sora são carregadas em `index.html`; Sora está disponível, mas não é a fonte global da shell. Não substituir Inter por Sora em módulos novos sem referência específica.

| Elemento | Tamanho / entrelinha | Peso | Observação |
|---|---|---|---|
| Título de secção no header | `17 / 20.4px` | 700 | Truncagem quando necessário |
| Breadcrumb | `13.6 / 17px` | 400 | Separador ciano |
| Nome do operador | `13 / 16px` | 600 | Sem quebra |
| Tipo de conta no header | `11 / 13px` | 500 | Metadado |
| Item de sidebar | `14.4 / 18px` | 500 | Escala específica da navegação |
| Grupo de sidebar | `10.8 / 13.5px` | 700 | `#7D8CA6` |
| Título de sheet / dialog de edição | `18 / 24px` | 600 | Navy |
| Descrição de sheet | `14 / 20px` | 400 | `#667085` |
| Título de etapa | `16 / 24px` | 600 | Separado do título do modal |
| Label de formulário | `14 / 20px` | 600 | Gap 8 px até ao campo |
| Campo / célula | `14 / 20px` | 400 | Texto operacional |
| Cabeçalho de tabela | `12 / 16px` | 600 | Sem caixa alta por defeito |
| Badge de estado | `12 / 16px` | 600 | Uma linha |
| Ajuda / erro | `12 / 16px` | 400 | Ícone de erro 16 px |
| Tab de página | `14px` | 600 | Altura 44 px |
| Tab de modal | `13 / 18px` | 600 | Pode quebrar |
| KPI: label | `11px` | 600 | Maiúsculas, tracking `0.1em` |
| KPI: valor | `21px`, `leading-tight` | 600 | Tracking `-0.02em`, números tabulares |
| Login: título | `24px` | 600 | Variante de autenticação |

Usar 400 para leitura corrente, 500 para navegação/metadados e 600 para labels/acções. Reservar 700 para hierarquias já presentes. Preservar `tabular-nums` em tabelas e indicadores financeiros. Identidades importantes podem ser semibold pelas classes específicas da tabela.

## 4. Dimensões e espaçamento

### 4.1 Referência rápida

| Elemento | Dimensão actual de referência |
|---|---|
| Header / cabeçalho da sidebar | 80 px de altura |
| Sidebar expandida / recolhida / mobile | 264 / 80 / 288 px |
| Item de sidebar | 43,2 px de altura |
| Input / botão de toolbar | 40 px de altura |
| Acção de tabela | 36 × 36 px |
| Filtro / actualizar | 40 × 40 px |
| Anterior / seguinte acima da tabela | 28 × 28 px, ícone 16 px |
| Fechar sheet | Habitualmente 36 × 36 px |
| Expandir linha | 32 × 32 px |
| Copiar inline | 20 × 20 px |
| Botão de rodapé de modal | Mínimo 44 px de altura |
| Cabeçalho / linha de tabela | 48 / 56 px declarados; podem crescer com o conteúdo |
| Checkbox partilhado | 20 × 20 px |
| Tab de página / tab de modal | 44 / mínimo 42 px |
| Pesquisa | 300 × 40 px, limitada ao espaço disponível |

### 4.2 Ritmo, raios e elevação

| Contexto | Valor |
|---|---|
| Padding exterior do conteúdo | 16 px; em `lg`, 32 px |
| Interior da página de dados | Referência 24 px |
| Intervalo entre acções da toolbar | 8 px |
| Grupos verticais numa página de dados | 16 px |
| Contagem → tabela | 12 px |
| Label → controlo | 8 px |
| Grupos de campos em modais | 24 px vertical e horizontal |
| Título → descrição de edição/detalhe | 4 px |
| Padding de edição / exportação | 24 px |
| Padding de detalhe estruturado | 28 px; até 480 px, 20 px vertical / 16 px horizontal |
| Raio de controlo / acção de tabela | 8 px |
| Raio de superfície / tabela / dialog | 12 px |
| Raio de CTA de toolbar reconhecido pelo CSS legado | 10 px |
| Badge / avatar | Pill / circular |

Não há uma escala única universal aplicada a todo o legado. Usar os valores por contexto, preservando a escala fraccionária da navegação.

| Superfície | Borda e sombra |
|---|---|
| Página de dados | 1 px `#D7E2F2`; `0 8px 24px rgba(20,49,99,.06)` |
| Dialog | 1 px `#D7E2F2`; `0 12px 32px rgba(20,49,99,.14)` |
| Select aberto | `#D7E2F2`; `0 12px 24px rgba(20,49,99,.14)` |
| KPI | `#E7ECF3`; `0 3px 12px rgba(20,49,99,.045)` |
| Input / pesquisa | Sem sombra em repouso; halo na interacção |
| Acção de tabela | Sem sombra no contexto global |

## 5. Shell e barra superior

Fontes: [layout.tsx](src/components/layout/layout.tsx), [Header.tsx](src/components/layout/Header.tsx).

A shell ocupa a altura do viewport. Em desktop, sidebar e área principal ficam lado a lado. O `main` tem `min-w-0`, scroll vertical próprio e fundo `#F6F5FA`. O header permanece sticky no topo do `main`, numa camada `z-20`. O copyright acompanha o conteúdo no fundo.

```text
┌──────────────────┬────────────────────────────────────────────┐
│ Marca Sómoney    │ Secção / rota             Perfil │ Sair     │ 80
├──────────────────┼────────────────────────────────────────────┤
│ Grupos de menu   │ 16 px mobile / 32 px desktop                │
│ Item activo     │ Tabs → superfície → toolbar → tabela         │
│ ...             │ Conteúdo e paginação                         │
│                 │ Copyright                                    │
└──────────────────┴────────────────────────────────────────────┘
    264 / 80 px
```

| Zona do header | Especificação |
|---|---|
| Estrutura | 80 px, branco, borda inferior `#EBECEF` |
| Padding | Esquerda 64 px / direita 16 px no mobile; 32 px em desktop |
| Menu mobile | Trigger 36 px a 16 px da esquerda; oculto em `lg` |
| Página | Secção e breadcrumb obtidos por `getPageHeader(pathname)` |
| Breadcrumb | “Dashboard”, `ChevronRight` 12 px ciano, nome da página |
| Perfil | Link `/perfil`; avatar 36 px visível em desktop; gap 12 px |
| Operador | Nome e tipo de conta, sem quebra; “...” durante loading |
| Separador de sessão | 1 × 24 px, `#E9ECEF` |
| Sair | Alvo 36 px, raio 8 px, fundo `#FFF5F5`, ícone 20 px |
| Hover de sair | Fundo `#EF4A00`, ícone branco; abre confirmação |

**Regra:** registar títulos de rotas novas em `pageHeaders.ts`. Evitar repetir secção/breadcrumb acima das tabs na área de conteúdo. O breadcrumb actual é informativo; não presumir que cada segmento já é um link.

## 6. Sidebar global e contextual

Fontes: [AppSidebar.tsx](src/components/layout/AppSidebar.tsx), [UserContextSidebar.tsx](src/components/layout/UserContextSidebar.tsx), [use-mobile.ts](src/hooks/use-mobile.ts).

### 6.1 Geometria e comportamento

| Propriedade | Actual |
|---|---|
| Desktop | A partir de 1024 px; expandida 264 px ou recolhida 80 px |
| Mobile | Abaixo de 1024 px; sheet de 288 px |
| Fundo / divisória | Branco / `#EBECEF` |
| Logo expandido | SVG Sómoney, largura 189 px |
| Marca recolhida | `/favIcon.png`, 36,9 × 36,9 px |
| Recolher/expandir | Círculo 32 px, sobreposição de 16 px na borda; ícone 16 px |
| Persistência | Cookie `sidebar_state`, 7 dias |
| Atalho | Ctrl+B / Cmd+B |
| Scroll | Navegável com scrollbar oculta |
| Navegação mobile | Fecha o menu ao seleccionar destino |

### 6.2 Anatomia e estados do item

Altura **43,2 px**, raio 8 px, padding horizontal 10,8 px, caixa de ícone 22 px, gap 10,8 px e texto 14,4/18 px. Recolhido, o item global ocupa 43,2 px de largura, centrado na faixa de 80 px; esconde rótulo e recebe tooltip à direita com offset 8 px.

| Estado | Aparência |
|---|---|
| Normal | Transparente, texto navy |
| Hover | Fundo `#EAF6F8` |
| Activo comum | Fundo `#EAF6F8`; marcador ciano 3,6 × 7,2 px à esquerda quando expandido |
| Dashboard activo global | Gradiente `90deg, #143163 22.8%, #17CFDA 102.3%`; texto/ícone brancos |
| Foco | Ring ciano 2 px e offset 2 px |

Grupos expandidos: padding lateral 14,4 px, em desktop 18 px; vertical 18 px. Labels 10,8/13,5 px bold `#7D8CA6`. Gap entre itens 4,5 px; recolhido 3,6 px e sem títulos de grupo.

### 6.3 Organização global

| Grupo | Itens actuais |
|---|---|
| Estatísticas | Dashboard |
| Gestão | Gestão de Utilizadores |
| Operações | Transferências, Pagamentos, Depósitos, Levantamentos, Movimentos |
| Relatórios | Relatórios |
| Controle | Referências, Logs, Saldo por utilizador |
| Administração e Configurações | Gestão de Níveis, Config. Empresas, Webhooks, Permissões, Utilizadores backoffice, Serviços, Bancos, Campanhas, Promoções, Publicidades, FAQs, Meu Perfil |

Visibilidade por `canViewMenu`, perfil normalizado e chave de menu; grupos vazios são removidos. O código mostra itens enquanto o perfil não está resolvido. A apresentação do menu não substitui permissões da rota/operação.

### 6.4 Contexto de utilizador

Mantém marca, dimensões e recolhimento. Acrescenta regresso “Gestão de Utilizadores”, divisória e título “Contexto do utilizador”. Navegação base: Visão Geral, Transferências, Pagamentos, Depósitos, Levantamentos, Movimentos, Relatórios e Gestão da Conta. Empresas podem ter Referências e Webhooks.

As rotas seguem `/gestao-de-utilizadores/:userId/...`. A decisão actual sobre contexto de empresa consulta `location.state` e dados de tipo/nome da empresa; preservar esse estado ao navegar. Visão Geral contextual usa ciano suave, sem herdar automaticamente o gradiente do Dashboard global.

## 7. Organização das páginas

### 7.1 Página de dados

Sequência: header global → tabs de categoria opcionais → `.ui-data-page` → toolbar → resumo opcional → contagem → tabela → paginação. Interior de referência 24 px, superfície branca com borda/raio/sombra definidos na secção 4. A tabela não encosta ao contorno exterior da página.

O contentor que reúne toolbar, resumos, `TableResults` e paginação recebe `.ui-data-stack`. Ele estabelece uma coluna com intervalos uniformes de **16 px** e elimina margens externas dos filhos; não somar `mt-*`, `mb-*` ou `space-y-*` para os mesmos intervalos. Na composição contextual aplica-se o mesmo ritmo. Se toolbar e tabela forem filhos directos de uma página com tabs, reservar 16 px no fim do painel de toolbar.

Usar `.ui-context-page` nas famílias de contexto que já seguem essa composição. Não introduzir um novo título/breadcrumb entre o header e as tabs.

### 7.2 Toolbar

Acções à esquerda e pesquisa à direita quando há espaço. Altura de 40 px, gap 8 px entre acções e alinhamento vertical central. Criação é principal navy; exportar é secundário ciano; filtro/actualizar são ícones. Ordem exacta depende das acções e permissões disponíveis.

Em ecrãs estreitos, quebrar/empilhar os grupos sem comprimir rótulos. As toolbars legadas usam `.ui-legacy-toolbar`, com acções e pesquisa dentro do fluxo normal; abaixo de 1024 px, pesquisa e acções ocupam linhas próprias e a pesquisa usa a largura disponível. Não posicionar a pesquisa absolutamente sobre o contador ou sobre a tabela. Há composições `lg` a 1024 px: verificar também a faixa intermédia.

### 7.3 Pesquisa e contagem

Pesquisa: 300 × 40 px, máximo 100% do espaço, padding lateral 40 px, `Search` de 16 px à esquerda, placeholder `#9AAAC0`, sem sombra em repouso. A referência usa `type="text"` com um limpar personalizado de 28 px e nome “Limpar pesquisa”. Não duplicar com o cancel nativo de `type="search"`.

Separar pesquisa de filtros: limpar pesquisa e limpar filtros alteram estados diferentes. A estratégia de consulta (local, debounce, submissão) pertence à página, não ao design system.

Todas as tabelas apresentam a barra `TableResultsHeader`, através de `TableResults`, imediatamente acima da superfície da tabela. Mostra o tipo de resultado, a quantidade visível e o total conhecido, por exemplo **“Pagamentos encontrados — 37 de 37”**, seguidos dos controlos anterior/seguinte. A paginação inferior mantém-se.

O primeiro número é a quantidade de linhas efectivamente apresentadas na página, após pesquisa local. O segundo é o total fornecido pela fonte de dados; não é calculado a partir do número de páginas. Em endpoints sem total conhecido, apresentar **“Pagamentos encontrados — 10 nesta página”**. Resultado vazio com total conhecido apresenta `0 de 0`; uma pesquisa local pode apresentar `0 de 120`, porque o total da fonte e os resultados visíveis são diferentes.

As antigas contagens simples de “Total geral de registos” são substituídas por esta barra. Resumos de domínio com montantes e métricas continuam em `.ui-inline-summary`, separados da contagem da página. `.ui-record-count` permanece apenas como compatibilidade do legado.

Quando uma tabela também apresentar indicadores de domínio, passá-los por `TableResults.leadingContent`, à esquerda da barra, e manter a contagem/paginação à direita. A faixa quebra automaticamente em linhas quando os dois grupos não couberem na mesma linha; os indicadores também podem quebrar entre si em ecrãs estreitos. Usar `.ui-inline-summary` para resumos de montantes e métricas.

## 8. Tabs

### 8.1 Tabs de página

`.ui-tabs` forma uma superfície contínua com o painel inferior.

| Propriedade | Actual |
|---|---|
| Largura base | 360 px, máximo 100% |
| Altura / gap | 44 px / 4 px |
| Padding | 0 16 px |
| Borda / raio | 1 px `#D7E2F2`; raio 8 px nos cantos superiores |
| Inactiva | Fundo `#F8FAFC`, texto navy |
| Hover inactiva | `#F1F6FC` |
| Activa | Branco, borda superior 4 px `#48B9FF` |
| Painel ligado | Canto superior esquerdo sem raio; continuação do contorno após a faixa |

O CSS actual reconhece a selecção através de classe contendo `border-t-4`. `aria-selected` sozinho não activa o estilo. Manter a classe de selecção e fornecer semântica acessível.

| Variação | Regra |
|---|---|
| `.ui-deposit-tabs` | 460 px |
| `.ui-payment-tabs` | Até 580 px |
| `.ui-payment-tabs-gpo` | Até 700 px; rótulos dos três modos sem quebra |
| Quatro ou mais tabs | Regra geral de largura total com scroll horizontal |
| FAQ | Largura das tabs acompanha o texto |
| `.ui-company-tabs` | Regras específicas; consultar a família antes de generalizar |

Sem margem vertical entre tabs e painel. Preservar wrappers `.payment-tabs-panel`/`.deposit-tabs-panel`, que também desenham a continuidade do contorno.

### 8.2 Tabs de modal

`.ui-modal-tabs` é um segmento interno, distinto das tabs ligadas à página: duas colunas, fundo `#F5F7FB`, borda `#E3EAF4`, raio 12 px, padding 4 px, gap 6 px, margem superior 20 px.

Botão: mínimo 42 px, raio 8 px, padding 9 × 12 px, texto 13/18 px semibold e quebra permitida. Activo branco, borda `#D5E0ED`, texto navy e sombra suave. Inactivo transparente/`#627089`; hover `#EBF1F8`. Foco outline 2 px `#48B9FF`.

Etapas usam `.ui-modal-step-heading`, título 16/24 px, indicador pill 12/16 px, divisor `#E3EAF4` e nota auxiliar opcional. Não usar a geometria de tabs de página dentro destes formulários.

## 9. Botões e acções

### 9.1 Hierarquia por contexto

| Tipo | Aparência e dimensão | Uso |
|---|---|---|
| Principal de toolbar | 40 px, `#143163`, branco, padding horizontal 16 px | Adicionar/criar |
| Secundário de toolbar | 40 px, `#EAF6F8`, borda `#ADCBD0`, navy | Exportar/auxiliares |
| Filtro / actualizar | 40 × 40 px, ícone 16 px, raio 8 px | Abrir filtros/recarregar |
| Limpar filtros | Mínimo 40 px, rosa suave e texto vermelho | Remover filtros aplicados |
| Principal de modal | Mínimo 44 px, largura total por defeito, navy/branco | Guardar/aplicar/exportar |
| Destrutivo de confirmação | 44 px, `#B42318`, branco; hover `#912018` | Eliminar |
| Acção de tabela | 36 × 36 px, ícone 18 px, raio 8 px | Ver/contexto/editar/eliminar |
| Copiar inline | 20 × 20 px, ícone 16 px | Copiar um valor |

O CSS legado promove o primeiro botão de algumas toolbars com `span` a principal. Estrutura e ordem podem mudar a aparência. Verificar a composição completa em vez de confiar só nas classes do botão.

### 9.2 Acções de linha

Reutilizar [TableActionButton](src/components/ui/table-action-button.tsx), com `action`, `tooltip` opcional e atributos normais de botão. `aria-label` permite nome específico do objecto.

| `action` | Ícone | Fundo | Cor | Hover |
|---|---|---|---|---|
| `view` | `Eye` | `#E8F0FF` | `#2678F2` | Azul sólido / branco |
| `context` | `ArrowUpRight` | `#F1E1FF` | `#A10CF5` | Roxo sólido / branco |
| `edit` | `Pencil` | `#E8F5EB` | `#14B94A` | Verde sólido / branco |
| `delete` | `Trash2` | `#FDECEC` | `#B42318` | Vermelho sólido / branco |

Grupo com gap 8 px, alinhado à esquerda pelo contrato actual; “Ações” começa no mesmo eixo do primeiro botão. Tooltip acima, offset 6 px. Não adicionar um segundo tooltip nativo ao componente.

Foco da primitiva segue o tom da acção; no contexto de tabela o CSS aplica halo azul-claro comum. Desactivado: opacidade 0,5 na primitiva; no contexto da tabela, 0,55 e saturação 0,65.

### 9.3 Limpar e actualizar

`ClearFiltersButton`: `CircleX`, “Limpar filtros”, fundo `#FFF5F5`, borda `#F1C7C7`, texto `#B83A3A`. Hover: `#FDE8E8`, borda `#E78383`, texto `#A92F2F`. Não confundir com eliminação vermelha sólida.

`RefreshButton`: `onRefresh`, `isLoading`, `className`; ícone roda e botão bloqueia durante loading. O nome acessível actual é “Actualizar”. `FilterButton` recebe `onClick` e `label`, usa o trigger partilhado.

### 9.4 Button de base

Variantes: `default`, `destructive`, `brand`, `outline`, `secondary`, `ghost`, `link`; composição `asChild` suportada.

| Tamanho | Declaração da primitiva |
|---|---|
| `default` | 36 px, padding horizontal 16 px |
| `sm` | 32 px, padding horizontal 12 px, texto 12 px |
| `lg` | 40 px, padding horizontal 32 px |
| `icon` | 36 × 36 px |

Toolbar/filtro/rodapé têm contratos próprios de 40/44 px que podem sobrepor a primitiva. `brand` isolado tem hover ciano sólido; na toolbar pode ser substituído por ciano suave.

**Regra:** durante submissão, impedir duplicação, preservar geometria e mostrar spinner/verbo em progresso. Botões auxiliares dentro de formulário declaram `type="button"`.

## 10. Inputs e formulários

### 10.1 Anatomia e API

Reutilizar [form-field.tsx](src/components/ui/form-field.tsx): `TextField`, `TextAreaField`, `NativeSelectField`, `DateField`, `FormField`.

```text
Label + indicação de obrigatório
                8 px
┌─────────────────────────────────────────┐
│ ícone opcional │ valor / placeholder     │ 40 px
└─────────────────────────────────────────┘
Ajuda ou erro com ícone
               24 px até ao próximo grupo no modal
```

`FormField`: `label`, `required`, `hint`, `error`, `state` (`default`, `error`, `success`), `className`, `children`. `error` prevalece sobre `state` e `hint`; asterisco vermelho decorativo.

`TextField` acrescenta `startAdornment`, `endAdornment`, `containerClassName`. Adornos decorativos medem 16 px e não recebem ponteiro; reservar 40 px de padding no lado correspondente. Mostrar senha/validar exige botão real, não adorno decorativo.

Input: 40 px, largura 100%, padding horizontal 12 px, raio 8 px, texto 14/20 px. Textarea: mínimo 104 px, padding 10 × 12 px, resize vertical; cargos usa 120 px como variante.

### 10.2 Matriz de estados

| Estado | Borda | Fundo / texto | Feedback |
|---|---|---|---|
| Vazio | `#C9D8E9` | Branco / placeholder `#8293AE` | Label visível |
| Hover | `#9FB5D2` | Branco | Sem sobrepor erro/desactivado |
| Premido / select aberto | `#2678F2` | Branco | Halo 3 px azul a 12% |
| Foco visível | `#48B9FF` | Branco | Halo 4 px ciano a 15% |
| Preenchido sem foco | `#B4C5D9` | Texto `#143163` | Não implica validação |
| Erro | `#D94343` | Valor mantém legibilidade | Mensagem e `AlertCircle` 16 px |
| Erro com foco | `#D94343` | — | Halo 4 px vermelho a 14% |
| Sucesso | `#16865B` | — | Validação explicitamente concluída |
| Sucesso com foco | `#16865B` | — | Halo 4 px verde a 14% |
| Só leitura | Conforme contexto | Fundo `#F8FAFC` | Valor consultável |
| Desactivado | `#DDE5F0` | Fundo `#F5F7FA`, texto `#8293AE` | Cursor bloqueado, sem halo, opacidade 1 |

Transições de cor/borda/halo 160 ms e transformação 100 ms. Os selectores de erro/sucesso não cobrem todas as combinações de `SelectTrigger` como cobrem inputs nativos: verificar o resultado do trigger no contexto final.

### 10.3 Semântica e obrigatoriedade

**Limite actual:** `FormField` apresenta label num `span`, sem gerar associação `htmlFor`/`id` nem IDs de mensagem. Os wrappers consomem `required` e não o encaminham ao controlo nativo; asterisco não activa validação obrigatória.

**Regra para novas implementações:** fornecer nome acessível, associar ajuda/erro com `aria-describedby` e comunicar obrigatoriedade ao controlo. `aria-required` comunica a condição; validação efectiva exige `required` no input ou lógica do formulário. Não equiparar aparência a semântica/validação.

### 10.4 Organização

Uma coluna por defeito; duas para pares relacionados que caibam no painel. Filhos com `min-width: 0`; campos longos podem ocupar linha inteira. Até 640 px, linhas de duas colunas em modais passam a uma.

O container controla o gap de 24 px; o campo controla 8 px internos. Não somar `mt-*`, `space-y-*` e `gap` para o mesmo intervalo. O bloco final remove margens de campos partilhados nos modais.

`Input` oferece placeholders por tipo. `FormNormalizer` acrescenta placeholders e opção vazia a controlos legados. Definir copy explícita no JSX evita depender de inferência por nome. Placeholder não substitui label.

`.ui-inline-validation` posiciona a validação dentro do campo; reservar espaço para a acção e representar loading/erro/sucesso sem criar outro CTA principal na linha.

## 11. Selects, datas, selecção e uploads

### 11.1 Select

`NativeSelectField` para selecção nativa; `Select` Radix para menu personalizado em portal. Trigger Radix 40 px, padding esquerdo 12 px/direito 40 px, chevron 16 px a 12 px da direita, valor numa linha.

Menu branco, raio 8 px, borda `#D7E2F2`, padding exterior e de viewport 4 px; no modo popper, largura pelo menos igual ao trigger. Opções mínimo 36 px, foco/seleccionado ciano suave e check à direita; desactivadas sem interacção e com opacidade reduzida.

Select nativo recebe chevron CSS no wrapper, com reacção a `:open`/`:active` quando suportado. Não acrescentar segunda seta.

### 11.2 Datas

`DateField` preserva o picker nativo, sem adorno final que bloqueie o calendário. `DateRangePicker` usa Popover/Calendar, dois meses e intervalo; apresenta `dd/MM/yyyy`, armazena `yyyy-MM-dd` e constrói datas locais por ano/mês/dia. Calendário em português, célula base 44 px.

**Excepção:** trigger do intervalo é compacto, texto 11 px/ícone 12 px, pensado para análise; não é a altura padrão de um campo de formulário.

### 11.3 Selecção e permissões

`Checkbox`: 20 px, raio `rounded-md`, borda `#C9D8E9`; seleccionado azul `#2678F2`/check branco. Indeterminado usa `Minus` e `aria-checked="mixed"`; foco ciano e desactivado com opacidade reduzida.

Existem switches de domínio, incluindo integração de conta, mas não uma primitiva genérica `Switch` em `components/ui`. Reutilizar o caso equivalente e manter nome/estado programático. Não apresentar `RadioGroup` como API já disponível.

Permissões de cargos usam accordions: trigger mínimo 48 px; linhas mínimo 44 px, padding 10 × 12 px, borda `#E5EBF4`, fundo `#F8FAFD`, raio 8 px, texto 13/18 px.

### 11.4 Uploads

Áreas de documentos cobertas pelo CSS global: borda tracejada 1,5 px `#CFD7E5`, raio 8 px, hover/focus-within `#17CFDA`, ajuda 12/16 px `#667085`. Associar área clicável ao input de ficheiro, mostrar selecção e restrições do domínio. Não inventar limites universais de tamanho/formato.

Foto de perfil é variante: mínimo 136 px, padding 16 × 20 px, gap 20 px, raio 12 px, fundo `#F8FAFC`; avatar exterior 96 px, imagem 86 px, câmara 34 px. Não aplicar esta geometria a documentos.

## 12. Tabelas, expansão e paginação

### 12.1 Contrato canónico

Aplica-se a tabelas em `.ui-data-page` e `.ui-context-page`.

| Propriedade | Especificação |
|---|---|
| Layout final base | `width: 100%`, `table-layout: auto`, `min-width: 0` |
| Wrapper | Borda 1 px `#E5EBF4`, raio 12 px, overflow horizontal local |
| Cabeçalho | 48 px, `#F5F7FB`, texto 12/16 px semibold |
| Linha | 56 px declarados, divisor `#EEF2F7` |
| Célula | Padding 10 × 16 px, texto 14/20 px, centro vertical |
| Alinhamento | Esquerda, incluindo datas, valores, estados e acções |
| Linha par / hover | `#FBFCFE` / `#F5F9FF` |
| Números | `tabular-nums` |
| Última coluna | Compacta, largura base 1%, sem quebra |

O contrato posterior normaliza **16 px em ambos os lados** das células normais, substituindo regras anteriores de 20 px à direita. O QA histórico contém alinhamento de acções à direita; a implementação actual posterior normaliza à esquerda.

Não fixar todas as colunas por percentagem por defeito. Há excepções explícitas: pagamentos GPO usa layout fixo, mínimo **1120 px**, acções 8% com mínimo 92 px.

### 12.2 Conteúdo e identidade

Gestão de utilizadores possui classes próprias para nomes, contactos e identificadores. Preservar valores completos onde exigido; truncar apenas onde a referência permite, com acesso ao conteúdo integral. Datas e identificadores não devem quebrar arbitrariamente para caber: usar scroll horizontal local.

Checkbox numa coluna própria; regra existente preserva 20 px até ao primeiro dado. Acções via `TableActionButton`. Copy inline fica junto ao valor; `CopyTextButton` não renderiza valores vazios/nulos/`N/A` e interrompe a propagação antes de copiar.

### 12.3 Expansão

`TableRowExpandButton`: `expanded`, `expandLabel`, `collapseLabel`, `onClick`, `controls` opcional. Ícones `ChevronDown`/`ChevronUp` 18 px, alvo base 32 px.

| Hook | Função |
|---|---|
| `.ui-expand-toggle-column` | Coluna de 38 px, padding inicial 16 px |
| `.ui-expand-leading-column` | Dado seguinte com padding inicial 12 px |
| `.ui-expandable-row` | Altura livre e fundo alternado estável |
| `.ui-expandable-cell` | Célula abrangente sem padding, alinhada à esquerda |
| `.ui-expandable-content` | Mínimo 56 px, padding 10 × 16 px |

Botões na expansão são de conteúdo: largura automática, mínimo 32 px, gap 8 px, padding 4 × 8 px. Não herdam o quadrado de 36 px da última coluna normal.

### 12.4 Loading, vazio e falha

`TableStateRow` aceita `loading`/`empty`, `colSpan`, mensagem e filhos opcionais. Loading usa `LoaderCircle` azul, vazio `Inbox`; ícone 28 px, área interna mínima 144 px e padding vertical 32 px. O CSS da célula pode adicionar padding exterior.

Não passar `state="error"`: a API não suporta. Falha de consulta precisa de mensagem e recuperação adequadas ao domínio. Não mostrar “sem registos” quando a consulta falhou.

### 12.5 Paginação

`PaginationFooter`: “Página X de Y” à esquerda; anterior, números, reticências e seguinte à direita. Alvos 36 px, raio 8 px, gap 6 px. Activa navy/branco; hover suave nas restantes.

Apresenta no mínimo uma página, mesmo com zero registos. Anterior bloqueia na primeira; seguinte na última e com `totalPages=0`. Activa tem `aria-current="page"` e está desactivada. A página fornece totais, intervalo e callbacks; não existe quantidade universal de registos por página definida pelo componente.

### 12.6 Barra superior de resultados e navegação

Referência: [table-results.tsx](src/components/ui/table-results.tsx). Obrigatória nas tabelas de dados globais, contextuais e de administração, incluindo variantes por tabs.

| Elemento | Especificação |
|---|---|
| Composição | `TableResults` envolve o conteúdo da tabela e cria a barra antes do container com overflow |
| Alinhamento | À direita, contagem seguida das setas |
| Altura mínima / distância à tabela | 28 px / 12 px |
| Texto | Inter 13/20 px, peso 500, `#637590`, números formatados em `pt-AO` |
| Gap texto → navegação | 8 px |
| Navegação | `ChevronLeft` / `ChevronRight`, ícones de 16 px |
| Alvo de cada seta | 28 × 28 px, raio 6 px, sem borda, fundo transparente |
| Gap entre setas | 2 px |
| Hover | Fundo `#F1F5FA`, ícone `#143163` |
| Foco | Outline 2 px `#48B9FF`, offset 2 px |
| Desactivado | Ícone `#B4BFCE`, cursor bloqueado |
| Mobile | Texto pode quebrar; navegação não encolhe; barra fica fora do scroll horizontal |
| Movimento reduzido | Sem transição dos botões |

A barra permanece no fluxo vertical de `TableResults`: 12 px entre a barra e a superfície com borda/overflow. O contentor não acrescenta margens à tabela; para manter uma folga igual à dos outros grupos, remover `mt-*`/`mb-*` do `containerClassName`. A distância entre pesquisa ou resumo e esta barra é determinada por `.ui-data-stack` (16 px por intervalo). A pesquisa nunca partilha a mesma linha/posição da contagem por sobreposição.

API: `label` (inclui concordância, como “Contas encontradas”), `visibleCount`, `totalCount` opcional, `currentPage`, `totalPages`, `onPreviousPage`, `onNextPage`, `isLoading`. `TableResults` recebe também `containerClassName` e `children`, preservando o contorno/overflow da tabela original.

Os callbacks e os limites de página são os mesmos da paginação inferior, incluindo a navegação por cursor. Não manter um segundo estado de página. Durante consulta/actualização, mostrar “A carregar…” e bloquear as duas setas. Na primeira página, anterior fica bloqueado; na última, seguinte fica bloqueado. Estado anunciado com `role="status"`, `aria-live="polite"`; navegação tem nome acessível específico da tabela.

O cabeçalho não percorre o DOM para contar linhas nem procura os botões inferiores: os dados e callbacks são fornecidos explicitamente pela página. Linhas de expansão e estados de loading/vazio não contam como registos visíveis.

## 13. Estados, badges e iconografia

### 13.1 Badge de estado

`.ui-status-tag`: `inline-flex`, largura pelo conteúdo, mínimo 24 px, padding 4 × 10 px, gap 4 px, raio 9999 px, texto 12/16 px semibold numa linha. Não impor largura fixa a todos os estados.

Usar os utilitários em `components/utils` e apresentadores de domínio. Classes legadas são remapeadas pelo CSS para os tokens da secção 2; o nome original do fundo nem sempre representa a cor final.

Pagamentos GPO: `SUCCESS`/`PAID`/`ACCEPTED` → sucesso; `FAILED`/`REJECTED`/`ERROR`/`CANCELED`/`CANCELLED` → perigo; `PENDING` → aviso. Texto e tom devem concordar usando os utilitários de label e cor.

### 13.2 Níveis e avatares

Reutilizar [level-badge.tsx](src/components/gestaoDeContas/level-badge.tsx) e SVGs de Bronze, Prata, Ouro e Platina disponíveis. A referência de tabela usa ícone de 20 px com nome; não substituir por emoji.

Avatares são recipientes circulares, com imagem recortada e fallback. Tamanhos variam: 36 px no header, 32 px em determinadas linhas e maiores em perfil/detalhe. `.ui-avatar` e `.ui-movement-direction-icon` são excluídos dos selectores de pill para preservar a geometria.

### 13.3 Ícones

| Uso | Origem / dimensão |
|---|---|
| Sidebar | `assets/sidebarIcons/figma`, caixa 22 px |
| Acções de tabela | Lucide, 18 px |
| Toolbar / adornos | Lucide, 16 px |
| Breadcrumb | `ChevronRight`, 12 px |
| Fechar sheet | Habitualmente 18 px |
| KPI | Lucide, 18 px, stroke 1,8 |
| Vazio/loading de tabela | 28 px |
| Copiar | `Copy`, 16 px |

Preservar a família oficial da navegação. Não misturar famílias com proporções/pesos diferentes em acções equivalentes. Ícone decorativo recebe `aria-hidden`; botão sem texto recebe nome acessível.

## 14. Modais e drawers por finalidade

### 14.1 Escolha e geometria

| Finalidade | Padrão | Dimensão/contexto |
|---|---|---|
| Decisão curta / eliminar | Dialog | `ConfirmDeleteDialog`, desktop até 440 px |
| Criar / editar | Sheet lateral direito | Variante de domínio, limite lateral geral 600 px |
| Filtrar | Sheet com corpo scrollável | Referência backoffice até 440 px; GPO 620 px |
| Exportar | `.ui-export-sheet` | Até 576 px, altura `100dvh` |
| Consultar detalhes | `.ui-detail-sheet--structured` | Até 640 px, painel completo com scroll |
| Etapas/permissões | `.ui-position-sheet` | Até 600 px, corpo por painéis |
| Terminar sessão | Dialog do header | Variante centrada, desktop cerca de 400 px |

### 14.2 Contrato comum

Dialog e Sheet usam Radix Dialog com portal. Overlay fixo preto a 50%; conteúdo `z-50`. Preservar título semântico, descrição quando necessária, foco contido e retorno ao trigger. A confirmação identifica a operação e o objecto afectado.

`DialogContent`: branco, centrado a 50%/50%, raio 12 px, padding 24 px, gap 16 px, largura máxima base `calc(100% - 2rem)` e `sm:max-w-lg` em desktop. Variantes podem reduzir a largura.

`SheetContent` aceita quatro lados; a referência operacional é direita. A base declara 75% de largura e `sm:max-w-sm`; o CSS global limita laterais a `min(600px, 100vw)`. **Max-width não atribui sozinho 600 px de largura:** a composição de domínio continua a determinar o tamanho.

O fechar automático do Sheet está oculto. Incluir `SheetClose` explícito e visível. Dialog tem fechar por defeito e opção `showCloseButton={false}`.

### 14.3 Cabeçalho e rodapé

Edição/detalhe: título 18/24 px semibold navy, descrição 14/20 px `#667085`, gap 4 px e espaço para fechar. Fechar habitualmente 36 px, fundo `#F5F7FA`, borda `#E3EAF4`, hover `#E8EEF6`, foco ciano.

Rodapé comum: divisor `#E5EBF4`, padding superior 16 px, gap 8 px, acções em coluna/largura total e mínimo 44 px. Último botão recebe navy por CSS. `.ui-edit-sheet-footer--horizontal` usa linha com gap 12 px; eliminação tem rodapé próprio horizontal/vermelho.

### 14.4 Criar / editar

`.ui-edit-sheet`: padding 24 px, cabeçalho/descrição, corpo de campos e rodapé separados. Campos com 8 px internos e 24 px entre grupos. Usar valores iniciais correctos e manter o contexto da página.

**Regra funcional:** evitar submissão duplicada, preservar dados em erro recuperável, actualizar a superfície após sucesso. Cancelar não submete. Confirmação de abandono é decisão de domínio, não comportamento universal do Sheet.

### 14.5 Filtros

Referência de utilizadores backoffice: `sm:max-w-[440px]`, padding 20/24 px. `.ui-filter-sheet-panel` tem corpo `flex:1`, `min-height:0`, scroll e contenção de overscroll; CTA em rodapé ou zona sticky.

`.ui-reference-filter-fields` mantém gap 24 px; datas relacionadas podem partilhar linha. Até 640 px, passar para uma coluna. Limpar filtros na página deve reflectir os filtros aplicados.

GPO: `.ui-gpo-filter-sheet` até 620 px; em largura ≥641 px e altura ≥700 px, corpo com scroll próprio e rodapé no fim. Identificador externo/intervalo podem ocupar a linha inteira.

### 14.6 Exportação

`.ui-export-sheet`: até 576 px, altura/max-height `100dvh`, padding 24 px, gap 16 px. Cabeçalho à esquerda, título 18/24 px, descrição 14/20 px; reserva 44 px à direita para fechar de 36 px.

Corpo com scroll quando necessário e CTA de 44 px em rodapé separado. Formatos/filtros pertencem ao domínio; não assumir que todos os módulos exportam Excel, CSV e PDF. Mostrar estado de exportação sem duplicar pedidos.

### 14.7 Detalhe estruturado

`.ui-detail-sheet.ui-detail-sheet--structured`: largura `min(640px, 100vw)`, altura/max-height `100dvh`, padding 28 px, gap zero, scroll vertical do painel inteiro. Até 480 px: padding 20 × 16 px.

Sequência de leitura: identidade/resumo, título de secção, divisor, pares label/valor. Label à esquerda/valor à direita são próprios do detalhe, sem alterar o alinhamento das tabelas. Hooks: `.ui-detail-sheet-header`, `.ui-detail-sheet-body`, `.ui-detail-sheet-footer`. Não assumir rodapé sempre fixo.

GPO: secções separadas por 20 px, gap interno 8 px, título 15/22 px semibold. Linhas grid `0.85fr / 1.15fr`, gap 16 px; labels 13 px, valores 14 px. Até 480 px: 12/13 px e gap 10 px. Valores longos usam `overflow-wrap:anywhere` dentro do painel.

Documentos, referências e saldo têm blocos próprios. Mostrar/ocultar saldo é acção explícita; eliminar referência preserva vermelho e confirmação contextual.

### 14.8 Cargos e permissões

`.ui-position-sheet`: até 600 px, `100dvh`, padding 24 px, overflow exterior oculto. Cabeçalho/rodapé não encolhem; tabs segmentadas; painéis com scroll próprio.

Track de duas etapas a 200%, cada painel 50%, transição 300 ms. Campos gap 24 px, textarea 120 px; permissões em accordion. CTA 44 px `#1D376D`, hover `#264783`; spinner 22 px, rotação 700 ms. Esta cor é excepção de domínio, não novo CTA global.

### 14.9 Eliminação e sessão

`ConfirmDeleteDialog`: até 440 px em desktop; ícone lixo 20 px num bloco 40 px rosa; texto à esquerda; Cancelar outline e Eliminar `#B42318` lado a lado. Loading desactiva os dois botões, apresenta spinner e “A eliminar…”.

**Limite:** `isLoading` não bloqueia automaticamente Escape, overlay ou X. Se o domínio exige impedir fecho durante o pedido, implementar e testar explicitamente.

Logout: dialog próprio com ícone central em bloco 50 px, texto centrado e Cancelar/Sair. Não generalizar esse layout para confirmações de eliminação.

## 15. Cards, dashboard, perfil e autenticação

### 15.1 Card e KPI

`Card` base fornece cores, sem impor raio/padding/borda/sombra universais. A composição determina a geometria. `CardHeader`, `CardContent`, `CardFooter` têm padding base 24 px com ajustes internos.

`KpiCard`: mínimo 128 px, padding 16 px, raio 12 px, borda `#E7ECF3`, sombra suave; faixa lateral 3 px recuada 12 px verticalmente; ícone 18 px num bloco 36 px/raio 12 px.

| Tom | Faixa | Fundo de ícone | Ícone |
|---|---|---|---|
| `blue` | `#2678F2` | `#EEF6FF` | `#2678F2` |
| `purple` | `#9B7BFF` | `#F4F1FF` | `#7956D8` |
| `green` | `#25B76F` | `#ECFBF3` | `#159B5B` |
| `orange` | `#EF8D2F` | `#FFF4E8` | `#D97917` |
| `cyan` | `#17CFDA` | `#EAFBFC` | `#0D9CA5` |
| `slate` | `#64748B` | `#F1F5F9` | `#475569` |

API: `label`, `value` string já formatada, `helper` opcional, `icon` Lucide, `tone`. O componente não formata moeda automaticamente.

### 15.2 Dashboard e gráficos

Reutilizar composições de `components/dashboard`, Recharts e `ui/chart.tsx`. Há filtros analíticos locais com labels de 8 px; são excepções e não substituem labels de formulário de 14 px.

Tokens `--chart-*` existem, mas não garantem paleta idêntica em cada gráfico. Preservar configuração série/cor, unidade, legenda e tooltip da família. Nova série precisa de identificação textual além da cor.

### 15.3 Perfil

`.ui-profile-layout` combina identidade/editor. Até 1100 px passa a uma coluna; até 640 px ajusta gaps, padding, tabs e pares de informação. Campos mantêm 40 px.

Acções `.ui-profile-action-primary`/`cancel` têm tons suaves e alinhamento inicial; não substituir automaticamente pelo rodapé navy de sheet. Foto segue a variante da secção 11.

### 15.4 Autenticação

Login usa coluna até 420 px, título navy 24 px, labels/campos partilhados, botão real mostrar/ocultar senha e erro “Credenciais inválidas!” com `role="alert"`. Visibilidade da senha tem nome variável e `aria-pressed`.

Link de recuperação azul com sublinhado em hover e foco visível. Login não recebe sidebar/toolbar da área autenticada.

## 16. Feedback, responsividade e movimento

### 16.1 Feedback

| Situação | Padrão |
|---|---|
| Consulta inicial | `TableStateRow` loading com mensagem |
| Sem registos | `TableStateRow` empty e acção útil quando aplicável |
| Recarregar | `RefreshButton` bloqueado com rotação |
| Submeter | Spinner + verbo em progresso, sem duplicação |
| Campo inválido | Mensagem local, borda e estado programático |
| Sucesso | Feedback e actualização da superfície relevante |
| Erro recuperável | Mensagem legível e opção de repetir preservando contexto |
| Conteúdo em espera | `Skeleton` com geometria próxima do conteúdo final |

`Toaster` partilhado usa Sonner e tokens de popover. React Toastify também existe no projecto. Não há contrato único comprovado de posição/duração para todos os fluxos: seguir a infra-estrutura da família e evitar notificações duplicadas.

Loading não significa zero registos; falha não significa lista vazia. Não expor erros técnicos crus ao utilizador.

### 16.2 Breakpoints

| Limite | Adaptação relevante |
|---|---|
| Até 480 px | Padding compacto de modais e ajustes GPO |
| Até 640 px | Campos em coluna, tabs e perfil |
| Até 900 px | Toolbar/pesquisa e composições legadas |
| Abaixo de 1024 px | Sidebar em sheet e trigger mobile |
| A partir de 1024 px (`lg`) | Sidebar fixa, padding principal 32 px |
| Até 1100 px | Perfil em uma coluna |

Não assumir breakpoints idênticos em todo o legado. Testar particularmente 900–1024 px, onde regras globais e utilitários se cruzam.

### 16.3 Scroll e camadas

Scroll principal no `main`; horizontal local nas tabelas. Filtros/formulários podem separar corpo scrollável de cabeçalho/rodapé; detalhe estruturado rola como painel inteiro.

Scrollbar geral fina: 6 px em WebKit, track transparente, thumb `rgba(20,49,99,.24)`, hover `.42`, raio pill. Sidebar oculta a barra mas permite scroll. Não ocultar overflow sem acesso a todo o conteúdo.

| Camada | Valor declarado |
|---|---|
| Sidebar fixa | `z-10` |
| Header | `z-20` |
| Overlay / conteúdo modal | `z-50` |
| Select / popover / tooltip | Geralmente `z-50`, em portal |
| Continuidade local de tabs | `z-2` / `z-3` |

Elementos em portal podem depender da ordem DOM. Verificar select/tooltip dentro de sheet antes de elevar z-index arbitrariamente.

### 16.4 Movimento

| Interacção | Declaração actual |
|---|---|
| Hover toolbar / tabs de página | 180 ms |
| Campos | 160 ms; transformação 100 ms |
| Linha de tabela / tab interna | 150 ms |
| Sidebar | 200 ms cor/layout; 300 ms expansão/labels |
| Dialog | 200 ms, fade + zoom de 95% |
| Sheet | Entrada 500 ms; saída 300 ms |
| Track de etapas | 300 ms |
| Spinner de cargos | 700 ms por rotação |

`prefers-reduced-motion` cobre partes da tabela/selects, sem garantia universal. Novas animações devem respeitar a preferência e não condicionar a compreensão do estado.

## 17. Conteúdo e acessibilidade

### 17.1 Vocabulário e formatos

Usar português e os termos da família: utilizador, conta, palavra-passe, levantamento, Guardar, Cancelar, Eliminar, Ver detalhes, Limpar filtros. Há variantes históricas como “Ações”/“Actualizar”; não renomear menus isoladamente numa alteração visual.

Datas seguem os formatadores existentes; intervalos usam `dd/MM/yyyy`. Moeda/sinal de movimentos reutilizam utilitários de domínio, incluindo [formatCorrencySigned.ts](src/components/utils/formatCorrencySigned.ts). Não alterar separador, casas decimais, símbolo ou timezone ao uniformizar aparência.

Identificadores preservam zeros iniciais e copy exacta. Ausência segue o fallback do domínio (`N/A`, “—” ou outro), sem aparentar sucesso.

### 17.2 Regras para novas implementações

- Acções têm nome acessível; tooltip complementa esse nome.
- Campos associam nome, ajuda e erro; obrigatoriedade é também programática.
- Tabelas usam semântica nativa e escopo de cabeçalhos.
- Tabs têm `tablist`, `aria-selected`, `aria-controls` e painel associado; implementar teclado adequado, não apenas aparência.
- Modais têm título e saída acessíveis; verificar Tab, Shift+Tab, Escape e retorno de foco.
- Estado inclui texto além da cor; ícones decorativos ficam fora da leitura assistiva.
- Conteúdo truncado continua acessível; informação essencial não depende apenas de hover.
- Foco permanece visível; não remover outline sem substituição.

Estas regras não certificam o código actual. Há alvos compactos de 20/28/32/36 px e combinações de contraste a avaliar no contexto final. O HTML raiz ainda declara `lang="en"`; não assumir que a correcção de idioma já foi implementada.

## 18. Receitas de implementação

### 18.1 Nova lista

1. Registar rota, header e menu/permissão quando aplicável.
2. Reutilizar shell; tabs apenas para categorias reais.
3. Compor `.ui-data-page`, interior 24 px e `.ui-toolbar`.
4. Acrescentar acções conforme domínio/permissões.
5. Pesquisa com nome acessível e um único limpar.
6. `TableResults` com quantidade visível, total real quando disponível e os callbacks da paginação; tabela no container de overflow preservado.
7. Acções via `TableActionButton`, copy via `CopyTextButton`.
8. Loading/vazio/falha e `PaginationFooter`.
9. Verificar dados longos, ausentes e vários estados.

Não existe um `DataTable` genérico que faça esta composição automaticamente.

### 18.2 Campo com associação acessível

```tsx
import { useId } from "react"
import { TextField } from "@/components/ui/form-field"

// Dentro do componente; IDs exclusivos por instância.
const emailId = useId()

<TextField
  id={emailId}
  type="email"
  label={<span id={`${emailId}-label`}>Email</span>}
  required
  aria-required="true"
  aria-labelledby={`${emailId}-label`}
  aria-describedby={emailError ? `${emailId}-error` : undefined}
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  placeholder="Digite o email"
  error={emailError ? <span id={`${emailId}-error`}>{emailError}</span> : undefined}
/>
```

Excerto de composição, com estado/validação fornecidos pelo formulário. A validação obrigatória continua a ser responsabilidade desse formulário: o wrapper actual não transmite `required` ao input.

### 18.3 Acções na tabela

```tsx
<td className="ui-actions-column">
  <div className="flex items-center gap-2">
    <TableActionButton
      action="view"
      aria-label={`Ver detalhes de ${name}`}
      onClick={() => openDetails(id)}
    />
    <TableActionButton
      action="edit"
      aria-label={`Editar ${name}`}
      onClick={() => openEdit(id)}
    />
  </div>
</td>
```

Renderizar apenas acções autorizadas; não converter a célula inteira num segundo botão.

### 18.4 Novo detalhe e eliminação

Detalhe: `SheetContent` com `.ui-detail-sheet.ui-detail-sheet--structured`, cabeçalho semântico/fechar explícito, `.ui-detail-sheet-body`, secções/divisores/pares e `.ui-detail-sheet-footer` quando necessário. Preservar limite 640 px, scroll do painel e quebra de valores longos.

Eliminação: `ConfirmDeleteDialog` com `open`, `onOpenChange`, `title`, `description`, `onConfirm`, `isLoading`, `confirmLabel` opcional. Identificar registo/consequência; fechar no sucesso; preservar recuperação em erro; decidir explicitamente o fecho durante pedido.

## 19. Inventário de componentes

Ficheiros reais em `src/components/ui/`; os contratos de contexto sobrepõem-se à primitiva quando indicado.

| Ficheiro | Responsabilidade |
|---|---|
| `button.tsx` | Variantes, tamanhos e `asChild` |
| `input.tsx` | Controlo base, placeholder e foco |
| `form-field.tsx` | Label/ajuda/erro e campos de texto/data/select/textarea |
| `form-normalizer.tsx` | Compatibilidade de placeholders e selects legados |
| `select.tsx` | Select Radix em portal |
| `checkbox.tsx` | Selecção e indeterminado |
| `country-dropdown.tsx` | País/bandeira; preservar variante específica |
| `calendar.tsx` | Calendário DayPicker português |
| `datepicker-range.tsx` | Intervalo em popover |
| `filter-button.tsx` | Trigger de filtro |
| `refresh-button.tsx` | Actualização e loading |
| `clear-filters-button.tsx` | Limpar filtros |
| `table-action-button.tsx` | Ver/contexto/editar/eliminar |
| `table-row-expand-button.tsx` | Expandir/recolher linha |
| `table-state-row.tsx` | Loading/vazio |
| `table-results.tsx` | Barra superior de contagem/anterior/seguinte e wrapper que a mantém fora do scroll |
| `copy-text-button.tsx` | Copiar valor inline |
| `pagination-footer.tsx` | Paginação e contador |
| `confirm-delete-dialog.tsx` | Confirmação destrutiva |
| `dialog.tsx` | Modal centrado e partes semânticas |
| `sheet.tsx` | Drawer e partes semânticas |
| `sidebar.tsx` | Provider, estado, persistência e navegação |
| `tooltip.tsx` | Ajuda em portal; sem atraso por defeito |
| `popover.tsx` | Conteúdo contextual, largura base 288 px, offset 4 px |
| `dropdown-menu.tsx` | Menu de acções Radix |
| `command.tsx` | Pesquisa/comandos com cmdk |
| `accordion.tsx` | Secções expansíveis; chevron base oculto |
| `collapsible.tsx` | Conteúdo recolhível; consultar API local |
| `separator.tsx` | Separador estrutural |
| `card.tsx` | Superfície e secções de card |
| `kpi-card.tsx` | Indicador com valor/helper/tom |
| `chart.tsx` | Infra-estrutura de gráficos |
| `skeleton.tsx` | Placeholder de carregamento |
| `sonner.tsx` | Toaster partilhado |

### Referências de composição por família

| Família | Exemplos reais |
|---|---|
| Utilizadores | [Lista](src/pages/gestao_contas.tsx), [detalhes](src/components/gestaoDeContas/details.tsx), [edição](src/components/gestaoDeContas/edit.tsx), [exportação](src/components/gestaoDeContas/export.tsx) |
| Cargos/permissões | [Criação](src/components/cargosPermisoes/adiciona.tsx), [edição](src/components/cargosPermisoes/edit.tsx) |
| Utilizadores backoffice | [Filtro](src/components/usersBackoffice/filter.tsx), [criação](src/components/usersBackoffice/adionar.tsx), [detalhes](src/components/usersBackoffice/details.tsx) |
| Pagamentos GPO | [Página](src/pages/pagamentosGPO.tsx), [filtro](src/components/pagamentosGPO/filter.tsx), [detalhes](src/components/pagamentosGPO/details.tsx) |
| Depósitos GPO | [Filtro](src/components/depositGPO/filter.tsx), [detalhes](src/components/depositGPO/details.tsx) |
| Tabs operacionais | [Pagamentos](src/components/pagamentos/PaymentsTabs.tsx), [depósitos](src/components/deposits/DepositTabs.tsx) |
| Configuração de empresas | [Página](src/pages/configGPO.tsx), [estados](src/components/ConfigsMerchants/gpoStatus.ts) |
| Perfil/login | [Perfil](src/pages/meuPerfil.tsx), [login](src/pages/login.tsx) |
| Conteúdo rico | `src/components/editor/`; preservar tema e ferramentas da família FAQ/campanha |

## 20. Excepções e limites

| Tema | Situação actual | Consequência |
|---|---|---|
| Proposta anterior | APIs/tokens sugeridos não existem todos | Não importar componentes hipotéticos |
| CSS legado | Depende de posição/filhos/classes | Verificar composição completa |
| Tabelas | Layout automático global; excepção GPO posterior | Não universalizar percentagens |
| Alinhamento | QA histórico à direita; CSS actual à esquerda | Seguir contrato posterior |
| Campos | Base 14/16, modais 24/24, detalhes com excepções | Ler escopo e último bloco |
| Tema escuro | Tokens coexistem com cores claras explícitas | Não declarar cobertura completa |
| FormField | Label/required visuais sem associação/validação automáticas | Completar semântica e lógica |
| Select | Cobertura de estados difere entre nativo/trigger | Verificar erro/sucesso/foco |
| Sheet | Fechar automático oculto; largura depende da variante | Incluir fecho e dimensão explícitos |
| Submissão | Loading não bloqueia todo o fecho do dialog | Definir comportamento de domínio |
| Toasts | Sonner/Toastify coexistem | Evitar duplicação/migração implícita |
| Responsividade | Limites 900/1024/1100 coexistem | Testar larguras intermédias |
| Acessibilidade | Não auditada integralmente | Sem alegação de conformidade automática |
| Referência local | Inclui alterações não commitadas | Rever documentação quando forem substituídas |

Estas diferenças não autorizam redesenho automático. Uma excepção nova deve indicar caso, motivo e referência, preservando as restantes regras.

## 21. Aceitação e manutenção

### 21.1 Checklist de similaridade

- [ ] Shell, rota, título e sidebar existentes reutilizados.
- [ ] Fonte, cor, hierarquia e dimensões do contexto correctos.
- [ ] Toolbar de 40 px, gap 8 px e pesquisa com um único limpar.
- [ ] Barra superior a 12 px da tabela, com quantidade visível/total real e setas sincronizadas com a paginação inferior.
- [ ] Sem total conhecido, usar “nesta página”; confirmar primeira/última página, vazio, pesquisa e loading.
- [ ] Tabela com cabeçalho/linha 48/56 px e padding lateral 16 px.
- [ ] Acções 36 px, ícones 18 px, cores/tooltips correctos.
- [ ] Tabs de página ligadas à superfície; modal com tabs próprias.
- [ ] Campos 40 px, label a 8 px e grupos de modal a 24 px.
- [ ] Hover, foco, preenchido, erro, sucesso, só leitura e disabled verificados quando aplicáveis.
- [ ] Modal com largura, scroll e rodapé da sua finalidade.
- [ ] Fechar/cancelar, loading e prevenção de duplicação definidos.
- [ ] Loading, vazio, erro e sucesso distinguíveis.
- [ ] Valores longos, ausentes, montantes e datas continuam legíveis.
- [ ] Permissões respeitadas em menu e acções.
- [ ] Labels, descrições, teclado e retorno de foco verificados.
- [ ] Desktop expandido/recolhido, largura intermédia, mobile e viewport baixo verificados.

### 21.2 Validação

Comparar a implementação nova com a mesma família no mesmo viewport, zoom e estado. Verificar desktop largo, sidebar recolhida, faixa próxima de 1024 px e mobile; para drawers, também viewport baixo/conteúdo longo.

Consultar dimensões computadas quando JSX e CSS divergem. Exercitar tabs, pesquisa, filtros, paginação, abertura/fecho e submissão/erro. Registar apenas os estados realmente observados. Build bem-sucedida não comprova similaridade visual.

Alterações de código exigem as verificações pertinentes. Alteração documental exige revisão das fontes, links e coerência; não necessita de executar build para confirmar que o documento foi guardado.

### 21.3 Evolução

Actualizar este documento juntamente com mudanças intencionais nos componentes partilhados. Registar data/versão, regra e famílias afectadas. Variação local de domínio não se torna padrão global sem revisão das restantes superfícies.

Um novo componente deve definir finalidade, anatomia, dimensões, variantes, estados, teclado, responsividade e exemplo real. Reutilizar a primitiva existente quando resolve o comportamento.

**Registo de versões:**

- **2.1 — 21/10/2026:** barra superior de resultados e navegação em todas as tabelas; contagem visível/total real, fallback para cursor sem total e sincronização com a paginação inferior.
- **2.0 — 21/10/2026:** especificação da implementação presente, substituindo a proposta 1.0 e tornando explícitos os contextos, dependências da cascata e limites ainda não verificados no browser.
