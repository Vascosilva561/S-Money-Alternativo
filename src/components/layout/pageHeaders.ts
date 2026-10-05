export type PageHeader = {
  section: string
  page: string
}

const pageHeaders: Record<string, PageHeader> = {
  "/gestao-de-utilizadores": {
    section: "Gestão",
    page: "Gestão de Utilizadores",
  },
  "/criacao-validacao-de-contas": {
    section: "Gestão",
    page: "Criação/Validação de Contas",
  },
  "/gestao-de-agentes": {
    section: "Gestão",
    page: "Agentes",
  },
  "/saldo-por-usuario": {
    section: "Gestão",
    page: "Lista de saldos por utilizador",
  },
  "/transferencias-somoney": {
    section: "Operações",
    page: "Transferências Sómoney",
  },
  "/pagamentos": {
    section: "Operações",
    page: "Pagamentos",
  },
  "/depositos": {
    section: "Operações",
    page: "Depósitos",
  },
  "/levantamentos": {
    section: "Operações",
    page: "Levantamentos",
  },
  "/movimentos": {
    section: "Operações",
    page: "Movimentos",
  },
  "/historico-de-relatorios": {
    section: "Relatórios",
    page: "Relatórios",
  },
  "/operacoes-backoffice": {
    section: "Controle",
    page: "Utilizadores backoffice",
  },
  "/cargos-permissoes": {
    section: "Administração e Configurações",
    page: "Cargos e Permissões",
  },
  "/config-de-empresas": {
    section: "Administração e Configurações",
    page: "Configuração de Empresas",
  },
  "/webhooks": {
    section: "Administração e Configurações",
    page: "Webhooks",
  },
  "/gestao-de-niveis": {
    section: "Administração e Configurações",
    page: "Gestão de Níveis",
  },
  "/usuarios-backoffice": {
    section: "Administração e Configurações",
    page: "Utilizadores backoffice",
  },
  "/servicos": {
    section: "Administração e Configurações",
    page: "Serviços",
  },
  "/bancos": {
    section: "Administração e Configurações",
    page: "Bancos",
  },
  "/campanhas": {
    section: "Administração e Configurações",
    page: "Campanhas",
  },
  "/indicacoes": {
    section: "Administração e Configurações",
    page: "Indicações",
  },
  "/publicidades": {
    section: "Administração e Configurações",
    page: "Publicidades",
  },
  "/otps": {
    section: "Administração e Configurações",
    page: "OTPs",
  },
  "/faqs": {
    section: "Administração e Configurações",
    page: "FAQ",
  },
  "/perfil": {
    section: "Administração e Configurações",
    page: "Meu Perfil",
  },
  "/margens": {
    section: "Administração e Configurações",
    page: "Margens",
  },
}

export function getPageHeader(pathname: string) {
  return pageHeaders[pathname]
}
