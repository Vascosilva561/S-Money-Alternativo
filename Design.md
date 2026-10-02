# Sómoney Backoffice — Design System

> Documento de referência para a linguagem visual e os padrões de interface do Sómoney Backoffice.

**Versão:** 1.0 — proposta
**Estado:** referência para implementação incremental
**Plataforma:** aplicação web responsiva
**Stack de referência:** React, TypeScript, Tailwind CSS, Radix UI e Lucide
**Idioma principal:** Português de Angola

---

## 1. Visão

O design system deve tornar o backoffice claro, previsível e rápido para operações financeiras, gestão de contas, análise de transações e administração.

A interface deve transmitir:

- confiança para ações financeiras e administrativas;
- hierarquia clara em grandes volumes de dados;
- feedback imediato para estados, validações e operações assíncronas;
- consistência entre listas, filtros, formulários, detalhes e confirmações;
- acessibilidade e uso confortável em desktop, tablet e mobile.

## 2. Princípios

### Clareza operacional

Cada tela deve responder rapidamente: onde estou, o que posso fazer, qual é o estado atual e o que acontece depois.

### Densidade controlada

O backoffice pode ser denso, mas não deve ser apertado. Usar tabelas compactas, espaços de seção previsíveis e destaque apenas onde existe decisão.

### Estados explícitos

Loading, vazio, erro, sucesso, pendente, disabled e confirmação devem ser visíveis e consistentes. Nunca depender apenas da cor.

### Tokens antes de exceções

Cor, tipografia, raio, espaçamento, altura e foco devem vir de tokens. Valores arbitrários só podem existir quando forem documentados como exceção.

### Acessibilidade por padrão

Todo componente interativo deve ter nome acessível, foco visível, alvo adequado e comportamento de teclado definido.

### Evolução incremental

O sistema deve poder ser adotado página a página. Componentes de negócio não devem duplicar a implementação visual das primitivas.

---

## 3. Arquitetura do sistema

```text
src/
  styles/
    tokens.css                 # tokens da marca e semântica
  components/
    ui/                         # primitivas genéricas
      accordion.tsx
      button.tsx
      card.tsx
      dialog.tsx
      input.tsx
      select.tsx
      sheet.tsx
      skeleton.tsx
      tooltip.tsx
      ...
    patterns/                   # padrões específicos do backoffice
      DataTable.tsx
      DrawerForm.tsx
      EmptyState.tsx
      Field.tsx
      IconButton.tsx
      PageToolbar.tsx
      Pagination.tsx
      StatusBadge.tsx
      SummaryCard.tsx
  lib/
    design-tokens.ts             # referências JS quando necessárias
    status-map.ts                # estados técnicos e visuais
```

### Camadas

| Camada | Responsabilidade | Pode conhecer regras de negócio? |
|---|---|---:|
| `styles` | tokens e base global | não |
| `ui` | comportamento e aparência genéricos | não |
| `patterns` | composição repetida do backoffice | apenas regras de apresentação |
| `pages` | dados, permissões, chamadas e fluxo | sim |
| `utils` | formatação e normalização | sim, quando reutilizável |

---

## 4. Fundamentos visuais

### 4.1 Cores

### Cores de marca

| Token | Valor | Uso principal |
|---|---|---|
| `--brand-navy` | `#143163` | texto forte, navegação, ação principal |
| `--brand-cyan` | `#17CFDA` | destaque, hover, indicadores ativos |
| `--brand-cyan-soft` | `#EAF6F8` | ações secundárias e superfícies suaves |
| `--brand-blue-soft` | `#DDEAFE` | informação e estados validados |

### Superfícies

| Token | Valor | Uso |
|---|---|---|
| `--surface-app` | `#F6F5FA` | fundo da área autenticada |
| `--surface-card` | `#FFFFFF` | cards, tabelas, dialogs e drawers |
| `--surface-subtle` | `#F8FAFC` | linhas alternadas e áreas secundárias |
| `--surface-hover` | `#F0F4FA` | hover de linhas e itens |
| `--surface-disabled` | `#F2F4F7` | controles desativados |
| `--surface-overlay` | `rgb(0 0 0 / 50%)` | overlay de dialog e sheet |

### Texto e bordas

| Token | Valor | Uso |
|---|---|---|
| `--text-primary` | `#143163` | títulos, labels e valores importantes |
| `--text-secondary` | `#536176` | descrição e texto auxiliar |
| `--text-tertiary` | `#667085` | metadados e informação de baixa prioridade |
| `--text-disabled` | `#98A2B3` | conteúdo disabled |
| `--border-control` | `#ADCBD0` | inputs, selects e controls |
| `--border-subtle` | `#EBECEF` | tabelas e divisórias |
| `--border-strong` | `#C8D7EF` | contorno de card ou seção destacada |
| `--focus-ring` | `#143163` | foco de teclado |

### Cores semânticas

O estado deve ter texto, fundo e, quando necessário, ícone. Nunca comunicar estado apenas por cor.

| Tom | Texto | Fundo | Uso |
|---|---|---|---|
| `success` | `#0A7A31` | `#E5F5EA` | concluído, ativo, operacional |
| `warning` | `#8A5A00` | `#FFF4CC` | pendente, atenção, revisão |
| `danger` | `#B42318` | `#FDECEC` | erro, rejeitado, destruição |
| `info` | `#035AAA` | `#E6F0FF` | informação, validado, detalhe |
| `neutral` | `#536176` | `#F2F4F7` | desconhecido, inativo, neutro |

### Regras de contraste

- texto normal: mínimo de 4.5:1;
- texto grande: mínimo de 3:1;
- ícones e bordas que comunicam estado: mínimo de 3:1 contra a superfície;
- foco deve ser visível contra o componente e o fundo;
- validar a combinação final, não apenas o hexadecimal isolado.

### Tokens CSS

```css
:root {
  --brand-navy: #143163;
  --brand-cyan: #17CFDA;
  --brand-cyan-soft: #EAF6F8;

  --surface-app: #F6F5FA;
  --surface-card: #FFFFFF;
  --surface-subtle: #F8FAFC;
  --surface-hover: #F0F4FA;
  --surface-disabled: #F2F4F7;

  --text-primary: #143163;
  --text-secondary: #536176;
  --text-tertiary: #667085;
  --text-disabled: #98A2B3;

  --border-control: #ADCBD0;
  --border-subtle: #EBECEF;
  --border-strong: #C8D7EF;
  --focus-ring: #143163;

  --success: #0A7A31;
  --success-bg: #E5F5EA;
  --warning: #8A5A00;
  --warning-bg: #FFF4CC;
  --danger: #B42318;
  --danger-bg: #FDECEC;
  --info: #035AAA;
  --info-bg: #E6F0FF;
  --neutral: #536176;
  --neutral-bg: #F2F4F7;
}
```

### 4.2 Tipografia

### Família

- **Inter:** família padrão para navegação, tabelas, labels, formulários e números.
- **Sora:** opcional para títulos de marca ou hero; não usar de forma misturada sem intenção.

```css
body {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

### Escala

| Token | Tamanho | Line-height | Peso | Uso |
|---|---:|---:|---:|---|
| `caption` | 12px | 16px | 400–600 | ajuda, metadados |
| `body-sm` | 14px | 20px | 400–600 | tabelas, controls |
| `body` | 16px | 24px | 400 | conteúdo corrido |
| `label` | 14px | 20px | 600 | labels de formulário |
| `heading-sm` | 18px | 24px | 700 | título de card ou drawer |
| `heading` | 24px | 32px | 700 | título de página |
| `display` | 32px | 40px | 700 | KPI ou destaque excepcional |

Regras:

- não usar texto menor que 12px;
- não usar `font-bold` para toda a UI;
- números financeiros devem usar tabular numerals quando possível;
- títulos de página devem ser únicos e descritivos;
- labels devem usar sentence case.

### 4.3 Espaçamento

Usar a escala de 4px:

| Token | Valor | Uso |
|---|---:|---|
| `space-1` | 4px | distância ícone/texto mínima |
| `space-2` | 8px | itens relacionados |
| `space-3` | 12px | grupos compactos |
| `space-4` | 16px | campos e controles |
| `space-5` | 20px | padding padrão de card |
| `space-6` | 24px | separação de seção |
| `space-8` | 32px | separação de blocos |
| `space-10` | 40px | separação ampla |
| `space-12` | 48px | hero ou transição de contexto |

Evitar `mt-[60px]` como espaçamento padrão de botão. O footer do formulário deve resolver o posicionamento com layout e padding consistentes.

### 4.4 Raios, bordas e elevação

| Token | Valor | Uso |
|---|---:|---|
| `radius-sm` | 6px | badges, pequenos controles |
| `radius-md` | 8px | inputs, buttons e cards pequenos |
| `radius-lg` | 10px | cards, drawers e dialogs |
| `radius-full` | 9999px | avatar e status pill |

| Token | Valor | Uso |
|---|---|---|
| `border-default` | 1px solid `--border-subtle` | separadores e cards |
| `border-control` | 1px solid `--border-control` | campos interativos |
| `shadow-card` | `0 4px 16px rgb(207 215 229 / 32%)` | card elevado |
| `shadow-overlay` | `0 12px 32px rgb(20 49 99 / 18%)` | dialog, sheet, popover |

Usar sombra para comunicar elevação, não para substituir bordas em toda a interface.

### 4.5 Ícones

- biblioteca padrão: Lucide;
- tamanho inline: 16px;
- botão com ícone: 20px;
- destaque ou navegação colapsada: 20–24px;
- stroke padrão: 1.75–2px;
- ícones não devem ser usados sem label quando representam ação;
- ícones decorativos devem ter `aria-hidden="true"`.

SVG proprietário só deve ser usado para marca, ilustrações e ícones sem equivalente adequado na biblioteca.

### 4.6 Motion

| Interação | Duração | Easing |
|---|---:|---|
| hover/focus | 150ms | ease-out |
| mudança de estado | 200ms | ease-in-out |
| drawer/sheet | 300ms | ease-in-out |
| feedback de sucesso | 200ms | ease-out |

Regras:

- não animar conteúdo essencial de forma que atrase a operação;
- respeitar `prefers-reduced-motion: reduce`;
- spinner deve indicar operação em curso e não sucesso;
- loading de tabela deve preservar o layout para evitar deslocamento.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 5. Componentes

### 5.1 Button

### Variantes

| Variante | Uso |
|---|---|
| `primary` | ação principal da tela ou formulário |
| `secondary` | ação importante, mas não principal |
| `outline` | ação alternativa de baixo peso |
| `ghost` | ação terciária ou contextual |
| `destructive` | exclusão, recusa, cancelamento irreversível |
| `link` | navegação ou ação em formato textual |

### Tamanhos

| Tamanho | Altura | Uso |
|---|---:|---|
| `sm` | 32px | toolbar densa, tabela |
| `md` | 40px | padrão |
| `lg` | 44px | ação primária de formulário |
| `icon` | 44×44px | ação somente com ícone |

### Estados

`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading` e `aria-busy`.

```tsx
<Button variant="primary" size="md" loading={isSaving}>
  Guardar alterações
</Button>
```

O estado loading deve manter a largura do botão, desativar a ação e fornecer texto acessível como “A guardar…”.

### 5.2 IconButton

Componente obrigatório para ações apenas com ícone.

```tsx
<IconButton label="Ver detalhes" variant="info">
  <Eye aria-hidden="true" />
</IconButton>
```

Regras:

- `label` obrigatório;
- `aria-label` gerado pelo componente;
- alvo mínimo de 44×44px;
- tooltip opcional em desktop;
- não usar tooltip como substituto de `aria-label`.

### 5.3 Field

Encapsula label, obrigatório, controle, ajuda, erro e descrição.

```tsx
<Field
  id="email"
  label="Email"
  description="Usado para iniciar sessão."
  error={errors.email}
  required
>
  <Input id="email" name="email" type="email" />
</Field>
```

Contrato:

- `id` obrigatório;
- `label` visível por padrão;
- `htmlFor` ligado ao controle;
- `aria-describedby` para ajuda/erro;
- `aria-invalid="true"` quando houver erro;
- mensagem de erro específica e acionável.

### 5.4 Input e Textarea

Padrão:

- altura mínima: 40px;
- padding horizontal: 12px;
- raio: `radius-md`;
- borda: `border-control`;
- texto: `body-sm`;
- placeholder: `text-tertiary`;
- foco: borda e ring de `focus-ring`;
- erro: borda `danger` e mensagem abaixo;
- disabled: fundo `surface-disabled`, cursor not-allowed e contraste legível.

Nunca usar `outline-none` sem fornecer um estado de foco equivalente.

### 5.5 Select

O `Select` deve usar o mesmo tratamento visual do `Input`.

Estados:

- placeholder;
- selecionado;
- aberto;
- foco;
- disabled;
- erro;
- sem resultados, quando aplicável.

Usar labels claros e não misturar `Todos`, `Todas` e `Selecione...` sem uma regra de contexto.

### 5.6 Checkbox, Switch e Radio

- usar quando a opção pode ser compreendida sem abrir outro menu;
- label deve incluir a área clicável;
- estado deve ser perceptível por forma e texto, não só por cor;
- switches devem representar configuração on/off, não seleção entre alternativas;
- foco deve aparecer no controle completo.

### 5.7 StatusBadge

Representa estado técnico normalizado.

```tsx
<StatusBadge status="PENDING" />
```

### Mapa canónico

```ts
export const statusMap = {
  SUCCESS: { label: "Concluído", tone: "success" },
  ACCEPTED: { label: "Concluído", tone: "success" },
  ACTIVE: { label: "Activo", tone: "success" },
  ENABLED: { label: "Operacional", tone: "success" },
  PENDING: { label: "Pendente", tone: "warning" },
  DEGRADED: { label: "Degradado", tone: "warning" },
  ERROR: { label: "Falhou", tone: "danger" },
  REJECTED: { label: "Rejeitado", tone: "danger" },
  CRITICAL: { label: "Crítico", tone: "danger" },
  PAID: { label: "Processada", tone: "info" },
  VALIDATED: { label: "Validado", tone: "info" },
  REFUNDED: { label: "Reembolso", tone: "info" },
  INACTIVE: { label: "Inactivo", tone: "neutral" },
  DISABLED: { label: "Inactivo", tone: "neutral" },
} as const;
```

O estado desconhecido deve renderizar `—` ou o valor de fallback com tom `neutral`; nunca desaparecer silenciosamente.

### 5.8 Card e SummaryCard

### Card

Estrutura opcional:

```text
Card
├── CardHeader
│   ├── título
│   └── descrição/ação
├── CardContent
└── CardFooter
```

Padrão:

- fundo branco;
- borda subtil ou sombra de card;
- padding de 20px;
- raio de 10px;
- título de 18px;
- não usar card apenas para envolver toda a página sem necessidade.

### SummaryCard

Usado para KPI, resumo financeiro ou contagem.

Conteúdo mínimo:

- label do indicador;
- valor principal;
- unidade, quando aplicável;
- comparação temporal ou contexto;
- estado de loading;
- tooltip ou descrição para números não óbvios.

### 5.9 PageToolbar

Padrão de entrada de página de lista.

```text
PageToolbar
├── título e descrição
├── ação primária
├── ações secundárias
├── Filtrar
├── Limpar filtro (quando aplicável)
└── pesquisa
```

Regras:

- ação primária alinhada à direita em desktop;
- em mobile, ações quebram para linhas próprias;
- pesquisa deve ter label acessível, mesmo quando visualmente usa placeholder;
- “Limpar filtro” só aparece quando há filtro ativo;
- não misturar ações de navegação e ações destrutivas na mesma hierarquia.

### 5.10 DataTable

### Estrutura

```tsx
<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  emptyState={<EmptyState title="Nenhum pagamento encontrado" />}
  rowActions={(row) => (
    <IconButton label={`Ver detalhes de ${row.id}`}>
      <Eye aria-hidden="true" />
    </IconButton>
  )}
/>
```

### Regras

- usar `caption` ou título associado quando o contexto não for evidente;
- `<th>` deve ter escopo correto;
- números alinhados à direita;
- datas e estados com formatação consistente;
- linhas clicáveis devem ter affordance e teclado;
- estado vazio não deve parecer erro;
- loading deve usar skeleton com a mesma geometria das linhas;
- overflow horizontal deve ser intencional e preservado em mobile;
- não esconder colunas essenciais sem alternativa acessível.

### Densidade

| Densidade | Altura de linha | Uso |
|---|---:|---|
| `comfortable` | 56px | tabelas com conteúdo rico |
| `compact` | 48px | operação diária |
| `dense` | 40px | logs e dados muito extensos |

Padrão do produto: `compact`.

### 5.11 Pagination

Deve incluir:

- página anterior;
- página seguinte;
- páginas visíveis;
- ellipsis quando necessário;
- estado disabled;
- indicação textual da página atual;
- quantidade por página;
- labels acessíveis nos botões.

Exemplo:

```tsx
<Pagination
  page={currentPage}
  pageCount={totalPages}
  pageSize={perPage}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPerPage}
/>
```

### 5.12 DrawerForm / Sheet

Usado para criação, edição, filtros e detalhes contextuais.

### Estrutura

```text
DrawerForm
├── Header: título + descrição + fechar
├── Body: conteúdo rolável
└── Footer fixo: cancelar + confirmar
```

Regras:

- título descreve a operação;
- foco entra no primeiro controle útil;
- fechar com Escape e botão visível;
- corpo pode rolar sem mover o footer;
- confirmar fica disabled durante submissão;
- erro de submissão aparece no contexto do campo ou no topo do formulário;
- fechar com alterações não guardadas deve pedir confirmação quando houver risco.

### 5.13 Dialog e confirmação destrutiva

Confirmações destrutivas devem conter:

- verbo explícito: “Eliminar”, “Recusar”, “Inactivar”;
- objeto da ação;
- consequência resumida;
- ação destrutiva em `danger`;
- cancelar como ação segura e não destrutiva;
- foco inicial na ação segura quando a operação for irreversível.

Não usar “Sim/Não” como único texto dos botões.

### 5.14 Toast

Tipos:

- `success`: operação concluída;
- `error`: operação falhou e pode exigir ação;
- `warning`: atenção ou sessão próxima do fim;
- `info`: confirmação informativa.

Regras:

- mensagem curta e específica;
- não esconder erros críticos rapidamente;
- não depender apenas do toast para validação de campo;
- ícone decorativo com texto equivalente;
- posição consistente: topo central para eventos globais, canto para eventos locais.

### 5.15 Loading e Skeleton

- usar skeleton quando o layout final for conhecido;
- usar spinner em ações pontuais ou áreas pequenas;
- preservar dimensões para evitar layout shift;
- texto “A carregar…” quando o estado não for autoexplicativo;
- não bloquear toda a página por carregamento de uma seção independente.

### 5.16 EmptyState

```tsx
<EmptyState
  title="Nenhum pagamento encontrado"
  description="Tente remover filtros ou pesquisar por outro termo."
  action={<Button variant="outline">Limpar filtros</Button>}
/>
```

Um estado vazio deve distinguir:

- ainda não existem dados;
- filtros não retornaram resultados;
- erro de carregamento;
- falta de permissão.

---

## 6. Padrões de página

### 6.1 Página de lista

```text
Layout
├── Sidebar
├── Header
└── Main
    ├── PageTitle
    ├── PageToolbar
    ├── SummaryCards (opcional)
    ├── TableMeta
    ├── DataTable
    └── Pagination
```

Ordem recomendada:

1. contexto da página;
2. ação principal;
3. filtros/pesquisa;
4. resumo;
5. dados;
6. paginação.

### 6.2 Dashboard

- filtros globais devem ficar juntos e ter escopo explícito;
- KPI deve mostrar período e unidade;
- gráficos devem ter legenda textual e não depender somente de cor;
- cards do mesmo grupo devem ter alturas compatíveis;
- loading e ausência de dados devem ser tratados por card;
- não misturar filtros locais e globais sem indicar a diferença.

### 6.3 Formulário

- agrupar campos por assunto;
- uma coluna em mobile;
- duas colunas apenas quando os campos forem relacionados e houver espaço;
- labels persistentes acima dos campos;
- campo obrigatório marcado no label e explicado no contexto;
- ações no footer;
- manter dados preenchidos quando houver erro de submissão.

### 6.4 Detalhes

- usar pares `label / valor`;
- valores financeiros alinhados e com unidade;
- estados sempre em `StatusBadge`;
- conteúdo copiável deve ter ação com tooltip e label acessível;
- documentos e links devem indicar abertura em nova aba quando aplicável.

### 6.5 Login

Desktop:

- composição em duas colunas;
- formulário centrado na coluna esquerda;
- banner ocupando a coluna direita;
- largura confortável do formulário, entre 360px e 440px.

Mobile:

- uma coluna;
- formulário ocupa quase toda a largura com padding de 24px;
- banner oculto ou reposicionado abaixo do formulário;
- nunca manter duas colunas comprimidas;
- ações com altura mínima de 44px.

---

## 7. Layout e responsividade

### Breakpoints

| Nome | Largura | Comportamento |
|---|---:|---|
| `sm` | 640px | ajustes de padding e controles |
| `md` | 768px | tablet, sidebar pode mudar de comportamento |
| `lg` | 1024px | layout desktop e duas colunas |
| `xl` | 1280px | maior área de dados e cards |
| `2xl` | 1536px | limitar largura de conteúdo quando necessário |

### Container

- largura total com `max-width` apenas quando melhora leitura;
- padding mobile: 16–24px;
- padding desktop: 20–32px;
- conteúdo principal não deve ficar colado à sidebar;
- footer global deve permanecer visualmente separado do conteúdo.

### Sidebar

Estados:

- expanded: 280px;
- collapsed: 80px visualmente;
- mobile: Sheet de aproximadamente 288px.

Regras:

- item ativo deve ser distinguível por fundo e texto;
- item colapsado precisa de tooltip e nome acessível;
- toggle deve ter `aria-label="Alternar menu lateral"`;
- foco deve permanecer visível;
- não usar labels de grupo apenas como ornamento se desaparecerem no estado colapsado.

### Tabelas em mobile

Escolher uma estratégia por tabela:

1. overflow horizontal para dados operacionais;
2. colunas prioritárias + detalhes em drawer;
3. transformação em lista/cartões para dados simples.

Não deixar a tabela simplesmente ultrapassar a viewport sem affordance de scroll.

---

## 8. Acessibilidade

### Semântica

- usar headings em ordem lógica;
- usar `<main>`, `<nav>`, `<header>`, `<section>` e `<footer>`;
- usar `<label htmlFor>` em todos os campos;
- definir `id` e `name` nos campos de formulário;
- usar tabelas semânticas para dados tabulares;
- usar `aria-live` para feedback assíncrono relevante.

### Teclado

- toda ação deve ser alcançável por Tab;
- Enter/Space devem funcionar conforme o tipo de controle;
- Escape fecha dialogs e drawers;
- foco deve ser devolvido ao trigger ao fechar overlay;
- não criar `div` clicável quando um button ou link resolver.

### Foco

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

Não remover o foco sem fornecer substituto equivalente.

### Formulários

- erro deve identificar o campo e explicar como corrigir;
- não usar placeholder como label;
- não limpar todos os campos por causa de um erro;
- indicar formato esperado antes do erro quando o formato não for óbvio;
- estados disabled devem continuar legíveis.

### Movimento

- respeitar redução de movimento;
- evitar auto-scroll inesperado;
- não comunicar somente por animação;
- feedback de carregamento deve ter texto ou semântica equivalente.

### Tamanho de alvo

- alvo recomendado: 44×44px;
- distância entre ações destrutivas e seguras deve ser suficiente;
- links e ícones em tabelas devem permanecer acionáveis em touch.

---

## 9. Conteúdo e nomenclatura

### Português de Angola

Usar terminologia consistente:

| Preferir | Evitar mistura |
|---|---|
| Palavra-passe | senha, password |
| Telemóvel | celular |
| Activo / Inactivo | Ativo / Inativo na mesma área |
| Eliminar | Apagar, remover sem contexto |
| Concluído | Sucesso, Processado sem distinguir o estado |
| Rejeitado | Recusado quando o significado for o mesmo |
| A carregar… | Loading, Carregando |

Quando o estado técnico tiver outra semântica, manter o label específico. Por exemplo, `PAID` pode ser “Processada”, enquanto `SUCCESS` pode ser “Concluído”, se essa diferença for real no domínio.

### Labels de ação

Usar verbos:

- Filtrar;
- Limpar filtros;
- Pesquisar;
- Ver detalhes;
- Guardar alterações;
- Cancelar;
- Confirmar;
- Eliminar;
- Exportar.

Evitar “Clique aqui”, “OK” e “Sim” sem objeto.

### Datas e moeda

- usar locale `pt-AO` quando suportado;
- exibir a unidade `Kz` de forma consistente;
- preservar casas decimais quando o valor for financeiro;
- datas devem indicar claramente o fuso quando o contexto exigir;
- números em tabela devem manter alinhamento consistente.

---

## 10. Regras de implementação

### Uso de tokens

Preferir:

```tsx
className="border-border-control text-text-primary bg-surface-card"
```

Evitar:

```tsx
className="ring-[#ADCBD0] text-[#143163] bg-[#FFFFFF]"
```

### Uso de componentes

Preferir:

```tsx
<Button variant="secondary">Filtrar</Button>
<IconButton label="Ver detalhes"><Eye /></IconButton>
<Field id="name" label="Nome"><Input id="name" name="name" /></Field>
```

Evitar:

```tsx
<button className="p-2 rounded-[6px] bg-[#EAF6F8] ...">
  <svg>...</svg>
</button>
```

### Exceções

Uma exceção visual deve:

1. ter motivo de produto ou acessibilidade;
2. ser limitada ao componente ou página necessária;
3. não criar uma nova variante informal;
4. ser registrada junto da revisão.

### Tipagem

Componentes de design system não devem usar `any`. Props devem ser explícitas e reutilizáveis.

---

## 11. Estratégia de migração

### Fase 0 — Fundação

- criar `tokens.css`;
- mapear tokens para Tailwind;
- remover configuração duplicada de sidebar;
- definir o mapa canónico de estados;
- alinhar nomes de conteúdo.

### Fase 1 — Primitivas

- normalizar Button, Input, Select, Dialog, Sheet, Tooltip e Skeleton;
- criar Field, IconButton e StatusBadge;
- documentar estados e tamanhos;
- adicionar testes de teclado e foco.

### Fase 2 — Listas

Migrar nesta ordem:

1. Pagamentos.
2. Pagamentos de referência.
3. Depósitos GPO.
4. Levantamentos.
5. Movimentos.
6. Gestão de contas.

Extrair DataTable, Pagination, PageToolbar e estados de loading/vazio.

### Fase 3 — Formulários

Migrar drawers de:

- criação e validação de contas;
- gestão de contas;
- usuários BackOffice;
- campanhas;
- bancos;
- serviços.

### Fase 4 — Layout e mobile

- corrigir o login para uma coluna abaixo de `lg`;
- definir comportamento do banner;
- validar sidebar mobile;
- rever tabelas largas;
- testar 390px, 768px, 1024px e desktop.

### Fase 5 — Documentação e qualidade

- criar rota `/design-system` ou Storybook;
- adicionar screenshots de referência;
- impedir novos hexadecimais de marca em páginas;
- impedir novos `any` nos componentes migrados;
- executar testes visuais nos estados principais.

---

## 12. Checklist de componente

Antes de considerar um componente pronto:

- [ ] API tipada e documentada;
- [ ] default;
- [ ] hover;
- [ ] active;
- [ ] focus-visible;
- [ ] disabled;
- [ ] loading, quando aplicável;
- [ ] erro, quando aplicável;
- [ ] estado vazio, quando aplicável;
- [ ] suporte a teclado;
- [ ] nome acessível;
- [ ] contraste validado;
- [ ] comportamento responsivo;
- [ ] reduced motion considerado;
- [ ] screenshot de referência;
- [ ] nenhum hexadecimal hardcoded sem justificativa.

## 13. Checklist de página

- [ ] título único e claro;
- [ ] hierarquia de headings correta;
- [ ] toolbar consistente;
- [ ] ação primária evidente;
- [ ] loading, erro e vazio definidos;
- [ ] todos os campos têm labels associados;
- [ ] ações com ícone têm labels acessíveis;
- [ ] tabelas têm overflow ou adaptação mobile;
- [ ] paginação possui estado atual e disabled;
- [ ] contraste validado;
- [ ] foco de teclado visível;
- [ ] layout testado nos breakpoints;
- [ ] sem duplicação de estilos já existente em `ui` ou `patterns`.

## 14. Critérios de sucesso

O design system estará operacional quando:

- novas páginas usarem tokens em vez de hexadecimais diretos;
- novos campos usarem `Field`;
- novas ações de ícone usarem `IconButton`;
- estados usarem `StatusBadge`;
- tabelas usarem `DataTable` e `Pagination`;
- alterações de cor, raio ou altura de controle puderem ser feitas num único lugar;
- login e sidebar forem utilizáveis em mobile;
- componentes base tiverem estados documentados;
- a dívida de lint não aumentar nas áreas migradas;
- as principais páginas mantiverem a mesma linguagem visual e comportamento.

---

## 15. Governança

### Quando criar um componente novo

Criar componente quando:

- o padrão aparece em pelo menos duas páginas;
- existe uma combinação de estados que precisa ser consistente;
- a acessibilidade depende de uma implementação centralizada;
- a alteração futura deve ser feita uma vez.

### Quando não criar

Não criar componente para:

- um bloco único sem comportamento próprio;
- uma simples composição de componentes existentes;
- esconder uma regra de negócio específica da página;
- evitar apenas uma pequena repetição local.

### Revisão

Toda alteração que introduza uma nova cor, variante, tamanho ou estado deve responder:

1. este caso já cabe num token existente?
2. este caso já cabe numa variante existente?
3. o novo comportamento aparece noutras páginas?
4. como será testado com teclado, mobile e leitor de ecrã?

### Definition of Done

Uma alteração do design system só está concluída quando código, documentação, estados, acessibilidade e screenshots estiverem alinhados.
