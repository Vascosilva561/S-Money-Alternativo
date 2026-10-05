import { useState } from "react"
import type { ComponentType, ReactElement } from "react"
import { ChevronsLeft, Cog, Webhook } from "lucide-react"
import { NavLink, useLocation } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DetailsUser } from "@/hooks/getDetails"
import { canViewMenu } from "@/components/permissions-profile/permissions"
import type { Role } from "@/components/permissions-profile/profiles"
import { normalizeRole } from "@/components/utils/normalizeRole"
import type { MenuKey } from "@/types/menuKeyType"
import SomoneyLogo from "@/assets/sidebarIcons/somoneyLogo"
import {
  BancosIcon,
  CampanhaIcon,
  DashboardIcon,
  DepositosIcon,
  FAQsIcon,
  GestaoContasIcon,
  GestaoNiveisIcon,
  HistoricoRelatoriosIcon,
  LevantamentosIcon,
  MeuPerfilIcon,
  MovimentosIcon,
  OperacoesBackofficeIcon,
  PagamentosIcon,
  ProdutosIcon,
  PromocoesIndicacoesIcon,
  PublicityIcon,
  SaldoPorUsuarioIcon,
  TransferenciasSomoneyIcon,
  UsuariosBackofficeIcon,
  UsuariosPermissoesIcon,
} from "@/assets/sidebarIcons/figma"

type SidebarItem = {
  title: string
  url: string
  icon: ComponentType<{ className?: string }>
  key: MenuKey
  dashboard?: boolean
  end?: boolean
}

type SidebarSection = {
  title: string
  items: SidebarItem[]
}

const menuSections: SidebarSection[] = [
  {
    title: "Estatísticas",
    items: [
      { title: "Dashboard", url: "/", icon: DashboardIcon, key: "dashboard", dashboard: true, end: true },
    ],
  },
  {
    title: "Gestão",
    items: [
      { title: "Gestão de Utilizadores", url: "/gestao-de-utilizadores", icon: GestaoContasIcon, key: "gestao_contas" },
    ],
  },
];

const pagamentosMenus: SidebarSection[] = [
  {
    title: "Operações",
    items: [
      { title: "Transferências", url: "/transferencias-somoney", icon: TransferenciasSomoneyIcon, key: "transferencias" },
      { title: "Pagamentos", url: "/pagamentos", icon: PagamentosIcon, key: "pagamentos" },
      { title: "Depósitos", url: "/depositos", icon: DepositosIcon, key: "depositos_gpo" },
      { title: "Levantamentos", url: "/levantamentos", icon: LevantamentosIcon, key: "levantamentos" },
      { title: "Movimentos", url: "/movimentos", icon: MovimentosIcon, key: "movimentos" },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { title: "Relatórios", url: "/historico-de-relatorios", icon: HistoricoRelatoriosIcon, key: "relatorios" },
    ],
  },
  {
    title: "Controle",
    items: [
      { title: "Logs", url: "/operacoes-backoffice", icon: OperacoesBackofficeIcon, key: "logs" },
      { title: "Saldo por utilizador", url: "/saldo-por-usuario", icon: SaldoPorUsuarioIcon, key: "saldo_por_usuario" },
    ],
  },
  {
    title: "Administração e Configurações",
    items: [
      { title: "Gestão de Níveis", url: "/gestao-de-niveis", icon: GestaoNiveisIcon, key: "gestao_de_niveis" },
      { title: "Config. Empresas", url: "/config-de-empresas", icon: Cog, key: "gestao_de_niveis" },
      { title: "Webhooks", url: "/webhooks", icon: Webhook, key: "gestao_de_niveis" },
      { title: "Permissões", url: "/cargos-permissoes", icon: UsuariosPermissoesIcon, key: "permissoes" },
      { title: "Utilizadores backoffice", url: "/usuarios-backoffice", icon: UsuariosBackofficeIcon, key: "usuarios_backoffice" },
      { title: "Serviços", url: "/servicos", icon: ProdutosIcon, key: "servicos" },
      { title: "Bancos", url: "/bancos", icon: BancosIcon, key: "bancos" },
      { title: "Campanhas", url: "/campanhas", icon: CampanhaIcon, key: "campanhas" },
      { title: "Promoções", url: "/indicacoes", icon: PromocoesIndicacoesIcon, key: "promocoes" },
      { title: "Publicidades", url: "/publicidades", icon: PublicityIcon, key: "publicidades" },
      { title: "FAQs", url: "/faqs", icon: FAQsIcon, key: "faqs" },
      { title: "Meu Perfil", url: "/perfil", icon: MeuPerfilIcon, key: "meu_perfil" },
    ],
  },
]

menuSections.push(...pagamentosMenus)

type WithTooltipProps = {
  children: ReactElement
  label: string
  isCollapsed: boolean
}

function WithTooltip({ children, label, isCollapsed }: WithTooltipProps) {
  if (!isCollapsed) return children

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function SidebarNavItem({ item, isCollapsed }: { item: SidebarItem; isCollapsed: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { pathname } = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const isSelected = item.end
    ? pathname === item.url
    : pathname === item.url || pathname.startsWith(`${item.url}/`)
  const isDashboardSelected = isSelected && item.dashboard
  const background = isDashboardSelected
    ? "linear-gradient(90deg, #143163 22.8%, #17CFDA 102.3%)"
    : isSelected || isHovered
      ? "#EAF6F8"
      : "transparent"

  return (
    <SidebarMenuItem className={isCollapsed ? "w-[43.2px]" : "w-full"}>
      <WithTooltip label={item.title} isCollapsed={isCollapsed}>
        <NavLink
          to={item.url}
          end={item.end}
          aria-label={item.title}
          data-selected={isSelected}
          style={{
            background,
            color: isDashboardSelected ? "#FFFFFF" : "#143163",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (isMobile) setOpenMobile(false)
          }}
          className={[
            "group/nav-item relative grid h-[43.2px] w-full min-w-0 grid-rows-1 items-center overflow-hidden rounded-lg px-[10.8px] text-left text-[14.4px] font-medium transition-[background-color,grid-template-columns,gap,padding] duration-200",
            "hover:bg-[#EAF6F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17CFDA]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            isCollapsed ? "grid-cols-[22px_0px] justify-center gap-0 p-0" : "grid-cols-[22px_minmax(0,1fr)] gap-[10.8px]",
          ].join(" ")}
        >
          {!isCollapsed && isSelected && !item.dashboard && (
            <span className="pointer-events-none absolute left-0 top-1/2 h-[7.2px] w-[3.6px] -translate-y-1/2 rounded-[38px] bg-[#17CFDA]" aria-hidden="true" />
          )}
          <span className="grid size-[22px] shrink-0 place-items-center" aria-hidden="true">
            <item.icon className={isDashboardSelected ? "brightness-0 invert" : undefined} />
          </span>
          <span
            aria-hidden={isCollapsed}
            className={`min-w-0 overflow-hidden whitespace-nowrap leading-[18px] transition-[max-width,opacity] duration-300 ${
              isCollapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
            }`}
          >
            {item.title}
          </span>
        </NavLink>
      </WithTooltip>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { state, open, setOpen } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { details } = DetailsUser()
  const role = normalizeRole(details?.account_type) as Role | null
  const visibleSections = menuSections
    .map((section) => ({
      ...section,
      items: role ? section.items.filter((item) => canViewMenu(item.key, role)) : section.items,
    }))
    .filter((section) => section.items.length > 0)

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="overflow-visible border-[#EBECEF] bg-white">
      <SidebarHeader className="relative h-20 shrink-0 border-b border-[#EBECEF] bg-white p-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Alternar menu lateral"
          title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className="absolute right-[-16px] top-1/2 z-50 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-[#EAF6F8] text-[#143163] shadow-sm ring-1 ring-[#ADCBD0] transition-colors duration-200 hover:bg-[#17CFDA] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#143163] focus-visible:ring-offset-2 lg:grid"
        >
          <ChevronsLeft className={`size-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>

        <NavLink to="/" aria-label="Ir para o Dashboard" className="relative flex h-full w-full items-center justify-center px-4">
          <span
            className={`absolute block w-[189px] origin-center [&>svg]:h-auto [&>svg]:w-full transition-[opacity,transform] duration-300 ${
              isCollapsed ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
            aria-hidden="true"
          >
            <SomoneyLogo />
          </span>
          <img
            src="/favIcon.png"
            alt={isCollapsed ? "Sómoney" : ""}
            aria-hidden={!isCollapsed}
            className={`size-[36.9px] object-contain transition-[opacity,transform] duration-300 ${
              isCollapsed ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
            }`}
          />
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="bg-white text-[#143163]">
        <nav aria-label="Menu principal" className="w-full">
          <SidebarGroup className={`w-full min-w-0 p-0 ${isCollapsed ? "gap-[3.6px] px-0 py-[14.4px]" : "gap-[10.8px] px-[14.4px] py-[18px] lg:px-[18px]"}`}>
            {visibleSections.map((section) => (
              <section key={section.title} className={`w-full min-w-0 ${isCollapsed ? "" : "space-y-[9px]"}`}>
                {!isCollapsed && (
                  <SidebarGroupLabel className="h-auto min-h-0 w-full p-0 text-[10.8px] font-bold leading-[13.5px] text-[#7D8CA6]">
                    {section.title}
                  </SidebarGroupLabel>
                )}
                <SidebarMenu className={isCollapsed ? "items-center gap-[3.6px]" : "gap-[4.5px]"}>
                  {section.items.map((item) => (
                    <SidebarNavItem key={`${section.title}-${item.title}`} item={item} isCollapsed={isCollapsed} />
                  ))}
                </SidebarMenu>
              </section>
            ))}
          </SidebarGroup>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
