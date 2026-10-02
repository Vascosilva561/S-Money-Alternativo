# Auditoria do design system — Sómoney Backoffice

Data: 2026-09-02

## Escopo e evidência

- Repositório analisado em `C:\Users\Vasco\Projectos\backOffice-somoney`.
- Inspeção de `src/index.css`, `tailwind.config.js`, `components.json`, componentes compartilhados e páginas representativas.
- Verificação renderizada da tela de login em viewport desktop, mobile (390×844) e estado de foco.
- O conteúdo autenticado não foi acessado porque não foram fornecidas credenciais; as conclusões sobre dashboard, tabelas e drawers são baseadas no código.

## Veredito

O produto tem um DNA visual claro — azul-marinho, turquesa, campos com borda azul-clara, tabelas compactas e estados em formato de pill — e usa Radix/shadcn como base técnica. Porém, a implementação está mais próxima de um conjunto de padrões copiados entre páginas do que de um design system governado.

Maturidade estimada:

- Identidade visual: média.
- Fundação de tokens: baixa.
- Reuso de componentes: baixa-média.
- Responsividade: baixa, com falha visível no login mobile.
- Acessibilidade: baixa, com riscos claros de associação de labels, nomes de botões e contraste.

## O que está funcionando

1. A paleta proprietária é consistente em boa parte do backoffice: `#143163`, `#17CFDA`, `#EAF6F8`, `#ADCBD0` e `#7D8CA6` aparecem como linguagem recorrente.
2. Select, Dialog, Sheet, Tooltip e Sidebar usam primitivas Radix, o que cria uma boa base para comportamento acessível e estados previsíveis.
3. Há tentativa de centralizar estados de negócio em helpers como `statusPaymentColor`, `statusTransactionsColor` e `statusLevantamentoColor`.
4. As listas mantêm uma estrutura reconhecível: toolbar, resumo, tabela, estado vazio e paginação.

## Principais riscos

### P0 — Login não reflowa corretamente em mobile

`src/pages/login.tsx:59-62` mantém o formulário e a imagem em duas colunas sem breakpoint; `src/pages/login.tsx:151-156` mantém o banner visível com `w-full h-screen`. Em 390px, a captura mostra o formulário estreito, o banner cortado e espaço vazio lateral. Este é um problema de usabilidade imediata.

### P1 — Tokens de marca não são a fonte de verdade

`src/index.css:88-156` define principalmente tokens neutros OKLCH, enquanto a aplicação usa a marca via centenas de classes hexadecimais. Foram encontrados aproximadamente 1.723 usos de `#143163`, 472 de `#ADCBD0`, 381 de `#7D8CA6` e 377 de `#17CFDA`. Há mais de 100 arquivos usando a borda de campo diretamente.

`tailwind.config.js:77-146` ainda mistura a configuração antiga com tokens `--sidebar-background` que não são os nomes usados em `src/index.css`, além de repetir a configuração de sidebar no fim do arquivo. Isso aumenta o risco de tokens sem efeito e torna a manutenção ambígua.

### P1 — Componentes compartilhados existem, mas não governam a UI

Há 20 arquivos em `src/components/ui`, porém os usos reais continuam majoritariamente nativos: aproximadamente 394 `<button>`, 283 `<input>`, 21 `<select>` e 11 `<textarea>`. O `Button` compartilhado aparece poucas vezes, enquanto buttons, inputs, tabelas e paginação são recriados nas páginas.

Há 23 arquivos com `<table>` e cerca de 70 arquivos com `<Sheet>`, mas não existem abstrações de `Badge/Status`, `Field`, `DataTable`, `Pagination`, `IconButton` ou `PageToolbar`. O padrão repetido em `src/pages/pagamentos.tsx:279-438` é um bom exemplo da duplicação.

### P1 — Semântica e acessibilidade estão abaixo do necessário

Foram encontrados 380 `<label>` e nenhuma associação `htmlFor/for`. No login, os labels são irmãos dos inputs (`src/pages/login.tsx:96-107`) e os inputs não têm `id`, `name` ou `aria-label`. O botão de visibilidade da senha também é apenas um ícone.

Há vários botões de ação apenas com SVG, por exemplo em `src/pages/pagamentos.tsx:420-426`, sem nome acessível. O toggle customizado da sidebar em `src/components/layout/AppSidebar.tsx:216-232` também não possui `aria-label` ou texto oculto.

### P1 — Contraste precisa de revisão

Sobre branco, os valores calculados para `#7D8CA6`, `#487FFF` e `#EF4A00` ficam aproximadamente em 3,40:1, 3,65:1 e 3,72:1. Eles aparecem como texto auxiliar, link e erro no login (`src/pages/login.tsx:91-92`, `src/pages/login.tsx:128-130`), portanto há risco de falha para texto normal.

### P2 — Escala tipográfica e espaçamento são implícitos

O sistema declara Inter e Sora, mas Sora não é usada. Há 202 usos de `text-[14px]`, 42 de `text-[12px]`, 37 de `text-[11px]` e 33 de `text-[16px]`; `rounded-[6px]` aparece cerca de 438 vezes e `mt-[60px]` cerca de 64 vezes. A repetição mostra uma preferência visual, mas não uma escala governada e fácil de alterar.

### P2 — Estados semânticos ainda divergem

Os helpers repetem cores, mas não partilham um mapa único. Por exemplo, `statusPaymentColor` só trata `SUCCESS/ERROR`, enquanto outras áreas tratam `PAID`, `PENDING`, `REJECTED`, `REFUNDED` e estados de conta. Também coexistem `Inative`, `Inactivo`, `Desactivado` e `INACTIVE` (`src/components/utils/getSituacaoColor.tsx:1-15`, `src/components/utils/statusIntegration.ts:6-16`).

### P2 — Motion e loading não têm política comum

Existem animações próprias e provenientes de Uiverse em `src/index.css:13-44` e `src/index.css:170-202`, mas não há tratamento de `prefers-reduced-motion`. O spinner usa classes dinâmicas em `src/components/utils/spinner.tsx:4-6`, o que pode impedir o Tailwind de gerar alguns estilos em produção.

## Plano recomendado

1. Definir tokens de marca em CSS variables: cor, superfície, texto, borda, foco, estados, raio, altura de controle e espaçamento. Mapear Tailwind apenas para esses tokens e remover a configuração duplicada de sidebar.
2. Criar a camada mínima de componentes: `Button`, `IconButton`, `Field`, `SelectField`, `StatusBadge`, `DataTable`, `Pagination`, `PageToolbar` e `DrawerForm`.
3. Migrar primeiro as páginas de lista e filtros; depois formulários e detalhes. Cada migração deve remover hexadecimais e markup repetido da página.
4. Corrigir a base mobile: empilhar o login, ocultar ou reposicionar o banner, reduzir padding lateral e garantir tabelas com estratégia explícita para overflow.
5. Aplicar baseline de acessibilidade: `id/htmlFor`, `aria-label` para ícones, foco `focus-visible`, alvos mínimos de 44px, contraste validado e suporte a redução de movimento.
6. Adicionar Storybook ou uma rota interna de showcase com estados de cada componente, mais testes visuais nos breakpoints 390, 768 e desktop.

## Verificação técnica

- `npm run build`: passou.
- `npm run lint`: 392 erros e 42 avisos; o maior grupo é `no-explicit-any`, seguido de variáveis não usadas, expressões sem efeito e dependências de hooks.

## Artefactos capturados

- `01-login.png`: login desktop.
- `02-login-mobile.png`: login a 390×844.
- `03-login-focus.png`: estado de foco no campo de email.
