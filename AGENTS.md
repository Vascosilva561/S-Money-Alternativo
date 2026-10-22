# Integrações no backoffice redesenhado

Este checkout é o redesign local do backoffice. A equipa mantém em paralelo uma versão em produção com interface e organização antigas. O utilizador determinou que o redesign local é a base visual e de navegação a preservar.

## Atualizações provenientes de outras branches

- Fazer `fetch` e comparar os commits antes de integrar. Identificar endpoints, formatos de resposta, campos, estados, permissões, validações e operações realmente novos.
- Integrar essas diferenças nas telas locais. Não substituir páginas, sidebar, rotas, estilos, componentes partilhados ou fluxos locais por versões completas da branch de produção para resolver conflitos.
- Commits que misturam interface antiga e regras de negócio devem ser adaptados por trechos. Reservar cherry-pick integral a mudanças independentes da interface e compatíveis com a base local.
- Fazer um snapshot recuperável antes de alterar trabalho local. Manter os backups até confirmar a recuperação e a integração; não descartar stashes de outros trabalhos.
- Não reaplicar a estratégia `ours`/`theirs` em bloco para resolver conflitos. Conferir contratos e preservar as duas intenções: experiência local e funcionalidade da equipa.
- Componentes novos devem usar os controles, tabelas, painéis, permissões e padrões visuais já existentes neste checkout.
- Separar contratos/adaptadores e regras de negócio da apresentação quando isso reduzir o risco das próximas integrações.
- Validar build, imports, paginação, filtros e ações afectadas. Distinguir validação local de confirmação contra a API real. Não executar operações financeiras reais para testar.

O inventário e os snapshots da recuperação da `session-token` estão em `docs/integracao-session-token.md`.
