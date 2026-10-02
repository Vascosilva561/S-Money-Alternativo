import type { ComponentType } from "react"

import bancosSvg from "./bancos.svg"
import dashboardSvg from "./dashboard.svg"
import depositosGpoSvg from "./depositos-gpo.svg"
import faqsSvg from "./faqs.svg"
import gestaoDeUtilizadoresSvg from "./gestao-de-utilizadores.svg"
import gestaoDeNiveisSvg from "./gestao-de-niveis.svg"
import levantamentosSvg from "./levantamentos.svg"
import logsSvg from "./logs.svg"
import meuPerfilSvg from "./meu-perfil.svg"
import movimentosSvg from "./movimentos.svg"
import otpsSvg from "./otps.svg"
import pagamentosSvg from "./pagamentos.svg"
import permissoesSvg from "./permissoes.svg"
import promocoesSvg from "./promocoes.svg"
import publicidadesSvg from "./publicidades.svg"
import relatoriosSvg from "./relatorios.svg"
import saldoPorUtilizadorSvg from "./saldo-por-utilizador.svg"
import servicosSvg from "./servicos.svg"
import transferenciasSvg from "./transferencias.svg"
import utilizadoresBackofficeSvg from "./utilizadores-backoffice.svg"

type FigmaSidebarIconProps = {
  className?: string
}

function createFigmaSidebarIcon(src: string): ComponentType<FigmaSidebarIconProps> {
  return function FigmaSidebarIcon({ className }) {
    return (
      <img
        src={src}
        width={22}
        height={22}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`block size-[22px] shrink-0 object-contain ${className ?? ""}`}
      />
    )
  }
}

export const DashboardIcon = createFigmaSidebarIcon(dashboardSvg)
export const FAQsIcon = createFigmaSidebarIcon(faqsSvg)
export const BancosIcon = createFigmaSidebarIcon(bancosSvg)
export const ProdutosIcon = createFigmaSidebarIcon(servicosSvg)
export const PublicityIcon = createFigmaSidebarIcon(publicidadesSvg)
export const OperacoesBackofficeIcon = createFigmaSidebarIcon(logsSvg)
export const HistoricoRelatoriosIcon = createFigmaSidebarIcon(relatoriosSvg)
export const MovimentosIcon = createFigmaSidebarIcon(movimentosSvg)
export const LevantamentosIcon = createFigmaSidebarIcon(levantamentosSvg)
export const DepositosIcon = createFigmaSidebarIcon(depositosGpoSvg)
export const PagamentosIcon = createFigmaSidebarIcon(pagamentosSvg)
export const TransferenciasSomoneyIcon = createFigmaSidebarIcon(transferenciasSvg)
export const GestaoContasIcon = createFigmaSidebarIcon(gestaoDeUtilizadoresSvg)
export const GestaoNiveisIcon = createFigmaSidebarIcon(gestaoDeNiveisSvg)
export const MeuPerfilIcon = createFigmaSidebarIcon(meuPerfilSvg)
export const CampanhaIcon = createFigmaSidebarIcon(publicidadesSvg)
export const PromocoesIndicacoesIcon = createFigmaSidebarIcon(promocoesSvg)
export const SaldoPorUsuarioIcon = createFigmaSidebarIcon(saldoPorUtilizadorSvg)
export const UsuariosBackofficeIcon = createFigmaSidebarIcon(utilizadoresBackofficeSvg)
export const UsuariosPermissoesIcon = createFigmaSidebarIcon(permissoesSvg)
export const OTPsIcon = createFigmaSidebarIcon(otpsSvg)
