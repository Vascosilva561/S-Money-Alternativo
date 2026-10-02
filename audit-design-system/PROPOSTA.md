# Proposta de reorganização do design system

## 1. Objetivo

Criar uma única linguagem visual e uma única camada de implementação para o backoffice, reduzindo a duplicação entre páginas sem obrigar a uma reescrita completa.

Princípios:

- tokens antes de componentes;
- componentes base antes de padrões de página;
- acessibilidade incorporada na API, não corrigida página a página;
- migração incremental, sem big bang;
- componentes de negócio separados das primitivas visuais.

## 2. Estrutura proposta

Manter `src/components/ui` para primitivas e acrescentar uma camada de padrões:

```text
src/
  styles/
    tokens.css
  components/
    ui/
      button.tsx
      input.tsx
      select.tsx
      dialog.tsx
      sheet.tsx
      ...
    patterns/
      Field.tsx
      IconButton.tsx
      StatusBadge.tsx
      PageToolbar.tsx
      SummaryCard.tsx
      DataTable.tsx
      Pagination.tsx
      DrawerForm.tsx
```

`ui` deve conhecer apenas estilo e comportamento genérico. `patterns` pode conhecer os padrões do backoffice, como toolbar de filtros, tabela com estado vazio e drawer de formulário.

## 3. Fundação de tokens

Criar `src/styles/tokens.css` e fazer `src/index.css` apenas importar os tokens e as camadas do Tailwind.

### Cores

| Token | Valor inicial | Uso |
|---|---:|---|
| `--brand-navy` | `#143163` | texto forte, navegação, ação principal |
| `--brand-cyan` | `#17CFDA` | destaque, hover primário, indicador activo |
| `--surface-app` | `#F6F5FA` | fundo da área autenticada |
| `--surface-subtle` | `#EAF6F8` | ação secundária, filtros |
| `--surface-card` | `#FFFFFF` | cards, drawers e tabelas |
| `--border-control` | `#ADCBD0` | inputs e selects |
| `--border-subtle` | `#EBECEF` | divisórias e tabelas |
| `--text-primary` | `#143163` | conteúdo principal |
| `--text-secondary` | `#536176` | texto auxiliar com contraste revisto |
| `--focus-ring` | `#143163` | foco de teclado |
| `--danger` | `#B42318` | erro, recusa, exclusão |
| `--warning` | `#8A5A00` | pendente, atenção |
| `--success` | `#0A7A31` | concluído, activo |
| `--info` | `#035AAA` | informação, validado |

Os valores devem ser validados em contraste antes da migração. Em particular, substituir o uso de `#7D8CA6`, `#487FFF` e `#EF4A00` como texto normal sobre branco.

### Escalas

```css
:root {
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --control-height: 2.5rem;
  --space-page: 1.25rem;
  --space-section: 1.5rem;
  --space-field: 1rem;
}
```

Usar a escala Tailwind para os casos normais. Valores arbitrários devem ser exceção documentada, não o padrão.

### Tipografia

- `Inter` para toda a interface.
- `Sora` apenas se houver uma decisão de marca para títulos; caso contrário, remover a configuração não utilizada.
- escala mínima: `caption 12`, `body-sm 14`, `body 16`, `heading-sm 18`, `heading 24`.
- evitar criar dezenas de variantes com `text-[14px]`, `text-[12px]` e similares diretamente nas páginas.

## 4. Componentes-base prioritários

### `Button`

O `Button` existente deve tornar-se a única implementação para ações textuais.

Variantes recomendadas:

- `primary`: fundo navy, texto branco;
- `secondary`: fundo cyan muito claro, borda de controlo;
- `outline`: fundo transparente, borda neutra;
- `destructive`: ação irreversível;
- `ghost`: ação terciária;
- `link`: navegação textual.

Incluir `loading`, `icon`, `disabled` e estados `focus-visible` consistentes.

### `IconButton`

API obrigatória com `label`:

```tsx
<IconButton label="Ver detalhes" variant="info">
  <Eye />
</IconButton>
```

O componente deve gerar `aria-label`, garantir alvo mínimo de 44px e padronizar hover, foco e disabled.

### `Field`

Encapsular label, input/select, ajuda e erro:

```tsx
<Field
  id="email"
  label="Email"
  error={errors.email}
  required
>
  <Input id="email" name="email" type="email" />
</Field>
```

Isso corrige a associação semântica que hoje falta nos labels e evita repetir classes de campo em todos os drawers.

### `StatusBadge`

Substituir os helpers de cor separados por um mapa único:

```ts
type StatusTone = "success" | "warning" | "danger" | "info" | "neutral"

const statusMap = {
  SUCCESS: { label: "Concluído", tone: "success" },
  PENDING: { label: "Pendente", tone: "warning" },
  REJECTED: { label: "Rejeitado", tone: "danger" },
  REFUNDED: { label: "Reembolso", tone: "info" },
}
```

O mapa deve separar estado técnico, label apresentado e tom visual. Assim, `ERROR`, `REJECTED`, `Inactivo` e `INACTIVE` podem ser normalizados sem duplicar cores.

### `DataTable` e `Pagination`

Extrair a estrutura repetida das 23 páginas com tabela:

- cabeçalho consistente;
- linhas alternadas e hover;
- loading com skeleton;
- estado vazio configurável;
- overflow horizontal controlado;
- ação da linha por `IconButton`;
- paginação com labels acessíveis e estado disabled.

### `PageToolbar` e `DrawerForm`

Criar padrões para:

- título/ações/filtros/pesquisa;
- resumo acima da tabela;
- drawer com cabeçalho, corpo rolável e footer fixo;
- botões de cancelar/confirmar sempre na mesma posição.

## 5. Migração por etapas

### Fase 0 — Preparação

- congelar os nomes dos tokens;
- corrigir `tailwind.config.js` e remover a configuração duplicada de sidebar;
- documentar os estados de negócio;
- não mexer ainda no comportamento das páginas.

### Fase 1 — Primitivas

- normalizar `Button`, `Input`, `Select`, `Dialog`, `Sheet`, `Tooltip` e `Skeleton`;
- adicionar `IconButton`, `Field` e `StatusBadge`;
- adicionar testes de acessibilidade e screenshots dos estados base.

### Fase 2 — Padrões de listas

Migrar primeiro as páginas com maior repetição:

1. Pagamentos.
2. Pagamentos de referência.
3. Depósitos GPO.
4. Levantamentos.
5. Movimentos.
6. Gestão de contas.

Extrair toolbar, resumo, tabela, estado vazio e paginação antes de avançar para as restantes.

### Fase 3 — Formulários e detalhes

Migrar os drawers de criação/edição/filtro para `Field` e `DrawerForm`. Priorizar:

- criação/validação de contas;
- gestão de contas;
- usuários BackOffice;
- campanhas;
- bancos;
- serviços.

### Fase 4 — Layout e responsividade

- corrigir o login para uma coluna abaixo de `lg`;
- esconder ou reposicionar o banner em telas pequenas;
- usar o Sheet da sidebar no mobile;
- definir comportamento de tabelas largas;
- testar 390px, 768px, 1024px e desktop.

### Fase 5 — Qualidade e documentação

- criar uma rota `/design-system` ou Storybook;
- publicar exemplos de cada componente e estado;
- adicionar lint sem novos `any` nos componentes migrados;
- usar screenshots de regressão para tokens e breakpoints.

## 6. Correções imediatas

Antes da migração completa, corrigir os seguintes pontos de maior impacto:

1. `src/pages/login.tsx:59-62` e `src/pages/login.tsx:151-156`: layout mobile.
2. `src/pages/login.tsx:96-107`: ids, names e associação dos labels.
3. `src/components/layout/AppSidebar.tsx:216-232`: label acessível do toggle.
4. `src/pages/pagamentos.tsx:420-426`: converter ação de detalhe em `IconButton`.
5. `src/components/utils/spinner.tsx:4-6`: remover classes Tailwind dinâmicas ou usar CSS/variáveis.
6. `src/index.css:88-156`: introduzir tokens reais da marca.

## 7. Critérios de aceitação

Considerar a reorganização concluída quando:

- novas páginas não usam hexadecimais de marca diretamente;
- novos campos usam `Field`;
- novas ações com ícone usam `IconButton` com label;
- estados usam `StatusBadge` e o mapa central;
- as tabelas usam `DataTable` e `Pagination`;
- login e sidebar passam nos breakpoints móveis;
- todos os componentes têm estado default, hover, focus, disabled, loading e erro documentados;
- não há regressões visuais nos fluxos migrados;
- o lint não aumenta a dívida existente.

## Resultado esperado

A equipa passa a alterar cor, raio, altura de controlo, foco ou estado uma única vez. As páginas ficam responsáveis por dados e regras de negócio, enquanto a camada visual passa a controlar consistência, acessibilidade e comportamento responsivo.
