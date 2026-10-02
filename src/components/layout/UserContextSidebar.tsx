import type { ReactElement } from "react"
import { useState } from "react"
import { ArrowLeft, ChevronsLeft } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import SomoneyLogo from "@/assets/sidebarIcons/somoneyLogo"
import {
  DashboardIcon,
  DepositosIcon,
  GestaoContasIcon,
  HistoricoRelatoriosIcon,
  LevantamentosIcon,
  MovimentosIcon,
  OTPsIcon,
  PagamentosIcon,
  TransferenciasSomoneyIcon,
} from "@/assets/sidebarIcons/figma"

type UserContextSidebarProps = {
  userId: string
}

const userContextMenu = [
  { label: "Visão Geral", path: "visao-geral", icon: DashboardIcon },
  { label: "Transferências", path: "transferencias", icon: TransferenciasSomoneyIcon },
  { label: "Pagamentos", path: "pagamentos", icon: PagamentosIcon },
  { label: "Depósitos", path: "depositos", icon: DepositosIcon },
  { label: "Levantamentos", path: "levantamentos", icon: LevantamentosIcon },
  { label: "Movimentos", path: "conta-corrente", icon: MovimentosIcon },
  { label: "Relatórios", path: "historico-relatorios", icon: HistoricoRelatoriosIcon },
  { label: "OTPs", path: "otps", icon: OTPsIcon },
  { label: "Gestão da Conta", path: "gestao-da-conta", icon: GestaoContasIcon },
]

function ContextTooltip({ children, label, isCollapsed }: { children: ReactElement; label: string; isCollapsed: boolean }) {
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

export default function UserContextSidebar({ userId }: UserContextSidebarProps) {
  const { state, open, setOpen, isMobile, setOpenMobile } = useSidebar()
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

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
        <div className={`shrink-0 border-b border-[#EBECEF] py-[10.8px] ${isCollapsed ? "px-0" : "px-[14.4px] lg:px-[18px]"}`}>
          <ContextTooltip label="Voltar à Gestão de Utilizadores" isCollapsed={isCollapsed}>
            <button
              type="button"
              onClick={() => navigate("/gestao-de-utilizadores")}
              aria-label="Voltar à Gestão de Utilizadores"
              className={`group/back-button relative grid h-[43.2px] w-full grid-rows-1 items-center overflow-hidden rounded-lg bg-transparent px-[10.8px] text-[14.4px] font-medium text-[#143163] transition-[background-color,grid-template-columns,gap,padding] duration-200 ${isCollapsed ? "grid-cols-[1fr] justify-items-center gap-0 p-0" : "grid-cols-[22px_minmax(0,1fr)] gap-[10.8px] hover:bg-[#EAF6F8]"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17CFDA]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            >
              {isCollapsed && <span className="pointer-events-none absolute inset-y-0 left-1/2 w-[43.2px] -translate-x-1/2 rounded-lg group-hover/back-button:bg-[#EAF6F8]" aria-hidden="true" />}
              <span className="relative z-10 grid size-[22px] shrink-0 place-items-center" aria-hidden="true">
                <ArrowLeft className="size-[22px] shrink-0" />
              </span>
              <span
                aria-hidden={isCollapsed}
                className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ${
                  isCollapsed ? "pointer-events-none absolute max-w-0 opacity-0" : "max-w-full opacity-100"
                }`}
              >
                Gestão de Utilizadores
              </span>
            </button>
          </ContextTooltip>
        </div>

        <nav aria-label="Menu contextual do utilizador" className={`min-h-0 w-full flex-1 overflow-y-auto py-[18px] ${isCollapsed ? "px-0" : "px-[14.4px] lg:px-[18px]"}`}>
          {!isCollapsed && (
            <p className="mb-[10.8px] px-[10.8px] text-[10.8px] font-bold uppercase tracking-[0.08em] text-[#7D8CA6]">
              Contexto do utilizador
            </p>
          )}

          <div className={isCollapsed ? "flex w-full flex-col items-stretch gap-[3.6px]" : "space-y-[4.5px]"}>
            {userContextMenu.map(({ label, path, icon: Icon }) => (
              <ContextTooltip key={path} label={label} isCollapsed={isCollapsed}>
                <NavLink
                  to={`/gestao-de-utilizadores/${userId}/${path}`}
                  state={location.state}
                  end
                  aria-label={label}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={({ isActive }) => `group/context-item relative grid h-[43.2px] w-full grid-rows-1 items-center overflow-hidden rounded-lg px-[10.8px] text-[14.4px] font-medium text-[#143163] transition-[background-color,grid-template-columns,gap,padding] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17CFDA]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isCollapsed ? "grid-cols-[1fr] justify-items-center gap-0 p-0" : "grid-cols-[22px_minmax(0,1fr)] gap-[10.8px] hover:bg-[#EAF6F8]"} ${isActive && !isCollapsed ? "bg-[#EAF6F8] hover:bg-[#EAF6F8]" : ""}`}
                >
                  {({ isActive }) => (
                    <>
                      {isCollapsed && (isActive || hoveredPath === path) && (
                        <span
                          className="pointer-events-none absolute inset-y-0 left-1/2 w-[43.2px] -translate-x-1/2 rounded-lg bg-[#EAF6F8]"
                          aria-hidden="true"
                        />
                      )}
                      {!isCollapsed && isActive && (
                        <span className="pointer-events-none absolute left-0 top-1/2 h-[7.2px] w-[3.6px] -translate-y-1/2 rounded-[38px] bg-[#17CFDA]" aria-hidden="true" />
                      )}
                      <span className="relative z-10 grid size-[22px] shrink-0 place-items-center" aria-hidden="true">
                        <Icon />
                      </span>
                      <span
                        aria-hidden={isCollapsed}
                        className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap leading-[18px] transition-[max-width,opacity] duration-300 ${
                          isCollapsed ? "pointer-events-none absolute max-w-0 opacity-0" : "max-w-full opacity-100"
                        }`}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              </ContextTooltip>
            ))}
          </div>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
