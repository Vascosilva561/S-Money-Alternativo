import { useContext, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AuthContext } from "@/context/auth"
import { DialogClose } from "@radix-ui/react-dialog"
import { DetailsUser } from "@/hooks/getDetails"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { UserAvatar } from "../utils/useAvatar"
import { SidebarTrigger } from "../ui/sidebar"
import logoutIcon from "@/assets/header/log-out.svg"
import { useLocation } from "react-router"
import { ChevronRight } from "lucide-react"
import { getAccountTypeLabel } from "@/components/utils/accountType"
import { getPageHeader } from "@/components/layout/pageHeaders"

export default function Header() {
    const { logout } = useContext(AuthContext)
    const [, setConfirmLogout] = useState(false)
    const { details, isLoading } = DetailsUser()
    const { pathname } = useLocation()
    const pageHeader = getPageHeader(pathname)

    function handleLogout() {
        logout()
        setConfirmLogout(false)
    }

    return (
        <header className="relative flex h-20 w-full items-center justify-between border-b border-[#EBECEF] bg-white pl-16 pr-4 lg:pl-8 lg:pr-8">
            <SidebarTrigger
                aria-label="Abrir menu lateral"
                className="absolute left-4 h-9 w-9 text-[#143163] lg:hidden"
            />

            {pageHeader && (
                <div className="min-w-0 pr-4 text-[#143163]">
                    <p className="truncate text-[17px] font-bold leading-[20.4px]">{pageHeader.section}</p>
                    <nav aria-label="Rota atual" className="flex min-w-0 items-center gap-1 text-[13.6px] leading-[17px]">
                        <span className="shrink-0">Dashboard</span>
                        <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-[#17CFDA]" />
                        <span className="truncate">{pageHeader.page}</span>
                    </nav>
                </div>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-4">
                <div className="flex shrink-0 items-center gap-3">
                    <div className="hidden size-9 items-center justify-center overflow-hidden rounded-full bg-[#F6F5FA] lg:flex">
                        <UserAvatar photo={details?.photo} />
                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-[2px] leading-none">
                        <h1 className="whitespace-nowrap text-[13px] font-semibold leading-4 text-[#1B2A4A]">
                            {isLoading ? "..." : details?.name}
                        </h1>
                        <p className="whitespace-nowrap text-[11px] font-medium leading-[13px] text-[#7D8CA6]">
                            {isLoading ? "..." : getAccountTypeLabel(details?.account_type)}
                        </p>
                    </div>
                </div>

                <span aria-hidden="true" className="h-6 w-px shrink-0 bg-[#E9ECEF]" />

                <Dialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Terminar sessão"
                                    onClick={() => setConfirmLogout(true)}
                                    className="group flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF5F5] p-2 transition-colors duration-200 hover:bg-[#EF4A00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4A00]/40 focus-visible:ring-offset-2"
                                >
                                    <img
                                        src={logoutIcon}
                                        alt=""
                                        className="size-5 transition-[filter] duration-200 group-hover:brightness-0 group-hover:invert"
                                    />
                                </button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Terminar sessão</p>
                        </TooltipContent>
                    </Tooltip>

                    <DialogContent className="sm:max-w-md md:w-[400px] p-3">
                        <div className="mt-2 flex w-full justify-center">
                            <div className="grid size-[50px] place-items-center rounded-lg bg-[#FF00001A] duration-300">
                                <img src={logoutIcon} alt="" className="size-7" />
                            </div>
                        </div>

                        <div className="space-y-6 p-4">
                            <div className="space-y-1 text-center">
                                <DialogTitle className="text-lg font-semibold text-[#143163]">Terminar sessão</DialogTitle>
                                <DialogDescription className="text-sm text-[#667085]">Tem a certeza de que pretende encerrar a sessão?</DialogDescription>
                            </div>
                            <div className="flex space-x-6">
                                <DialogClose asChild>
                                    <button
                                        type="button"
                                        className="w-full cursor-pointer rounded-md bg-[#F2F2F2] p-2 font-semibold text-[#616161] duration-300 hover:bg-[#e8e6e6]"
                                    >
                                        Cancelar
                                    </button>
                                </DialogClose>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="ml-2 w-full cursor-pointer rounded-md bg-[#E02E2E] p-2 font-semibold text-white duration-300 hover:bg-[#bf2626]"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    )
}
