import {
    Route, Routes, BrowserRouter,
    Navigate
} from "react-router"

import {
    //lazy, 
    useContext
} from "react";
import { AuthContext } from "@/context/auth";
import PrivateRoute from "./PrivateRoutes.routes";
import { Spinner } from "@/components/utils/spinner";
import { Toaster } from "sonner";
import Bancos from "@/pages/bancos";
import CargosPermissoes from "@/pages/cargosPermissoes";
import Dashboard from "@/pages/dashboard";
import Depositos from "@/pages/depositos";
import FAQs from "@/pages/FAQs";
import GestaoUtilizadores from "@/pages/gestao_utilizadores";
import { UserContextLayout } from "@/pages/user_context";
import UserOverview from "@/pages/user_overview";
import UserContextOperationsPage from "@/pages/user_context_operations";
import UserContextDepositsPage from "@/pages/user_context_deposits";
import { UserContextAccountManagement, UserContextOtps, UserContextReports } from "@/pages/user_context_account_pages";
import HistoricoDeRelatorioPage from "@/pages/historicosDeRelatorios";
import Levantamentos from "@/pages/levantamentos";
import Login from "@/pages/login";
import MeuPerfil from "@/pages/meuPerfil";
import GestaoDeNiveis from "@/pages/niveis";
import Movimentos from "@/pages/movimentos";
import NotFoundPage from "@/pages/notFoundPage";
import OTPs from "@/pages/OTPs";
import Pagamentos from "@/pages/pagamentos";
import RedefinePalavraPasse from "@/pages/redefine_palavra_passe";
import Servicos from "@/pages/servicos";
import TranferenciaSomoney from "@/pages/transferencia_somoney";
import UsuariosBackOffice from "@/pages/useuariosBackOffice";
import Logs from "@/pages/operacoes_backoffice";
import Publicidades from "@/pages/publicidades";
import Agentes from "@/pages/agentes";
import SaldoPorUsuario from "@/pages/saldo_por_usuario";
import Camapnhas from "@/pages/campanhas";
import Indicacoes from "@/pages/indicacoes";

export const Routers = () => {
    const { isAuthenticated, loading } = useContext(AuthContext)
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-[#143163] space-x-2">
                <Spinner color="#143163" width="60" height="60" /><p>A carregar...</p>
            </div>
        );
    }

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                    <Route path="/redefine-palavra-passe" element={<RedefinePalavraPasse />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        {/* gestao */}
                        <Route path="/gestao-de-utilizadores" element={<GestaoUtilizadores />} />
                        <Route path="/gestao-de-niveis" element={<GestaoDeNiveis />} />
                        <Route path="/gestao-de-utilizadores/:userId" element={<UserContextLayout />}>
                            <Route index element={<Navigate to="visao-geral" replace />} />
                            <Route path="visao-geral" element={<UserOverview />} />
                            <Route path="transferencias" element={<UserContextOperationsPage operation="transferencias" />} />
                            <Route path="pagamentos" element={<UserContextOperationsPage operation="pagamentos" />} />
                            <Route path="depositos" element={<UserContextDepositsPage />} />
                            <Route path="pagamentos-referencia" element={<Navigate to="../depositos?tab=referencia" replace />} />
                            <Route path="pagamento-gpo" element={<Navigate to="../depositos?tab=gpo" replace />} />
                            <Route path="levantamentos" element={<UserContextOperationsPage operation="levantamentos" />} />
                            <Route path="conta-corrente" element={<UserContextOperationsPage operation="conta-corrente" />} />
                            <Route path="historico-relatorios" element={<UserContextReports />} />
                            <Route path="otps" element={<UserContextOtps />} />
                            <Route path="gestao-da-conta" element={<UserContextAccountManagement />} />
                        </Route>
                        <Route path="/gestao-de-utilizadores/criacao-validacao" element={<Navigate to="/gestao-de-utilizadores" replace />} />
                        <Route path="/gestao-de-utilizadores/contas" element={<Navigate to="/gestao-de-utilizadores" replace />} />
                        <Route path="/criacao-validacao-de-contas" element={<Navigate to="/gestao-de-utilizadores" replace />} />
                        <Route path="/gestao-de-contas" element={<Navigate to="/gestao-de-utilizadores" replace />} />
                        <Route path="/gestao-de-agentes" element={<Agentes />} />

                        {/* operacoes */}
                        <Route path="/transferencias-somoney" element={<TranferenciaSomoney />} />
                        <Route path="/pagamentos" element={<Pagamentos />} />
                        <Route path="/depositos" element={<Depositos />} />
                        <Route path="/pagamentos-referencia" element={<Navigate to="/depositos?tab=referencia" replace />} />
                        <Route path="/pagamentos-gpo" element={<Navigate to="/depositos?tab=gpo" replace />} />
                        <Route path="/levantamentos" element={<Levantamentos />} />
                        <Route path="/movimentos" element={<Movimentos />} />

                        {/* relatorios */}
                        <Route path="/historico-de-relatorios" element={<HistoricoDeRelatorioPage />} />

                        {/* Controle */}
                        <Route path="/operacoes-backoffice" element={<Logs />} />
                        <Route path="/saldo-por-usuario" element={<SaldoPorUsuario/>}/>

                        {/* compiliance e antifraude */}
                        <Route path="/alertas" element={<Dashboard />} />
                        <Route path="/usuarios-bloqueados" element={<Dashboard />} />

                        {/* administracao e configuracoes */}
                        <Route path="/cargos-permissoes" element={<CargosPermissoes />} />
                        <Route path="/usuarios-backoffice" element={<UsuariosBackOffice />} />
                        <Route path="/servicos" element={<Servicos />} />
                        <Route path="/bancos" element={<Bancos />} />
                        {/* <Route path="/margens" element={<Margens />} /> */}

                        <Route path="/publicidades" element={<Publicidades />} />
                        <Route path="/otps" element={<OTPs />} />
                        <Route path="/faqs" element={<FAQs />} />
                        <Route path="/perfil" element={<MeuPerfil />} />
                        <Route path="/campanhas" element={<Camapnhas />} />
                         <Route path="/indicacoes" element={<Indicacoes />} />
                        

                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />


                </Routes>
            </BrowserRouter>
        </>
    )
}
