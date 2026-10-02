
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"



export default function ExpandirDepositos() {

    const [modalConfirmar, setModalConfirmar] = useState(false)
    const [modalRecusar, setModalRecusar] = useState(false)

    return (
        <>
            <div className="ui-expandable-content flex items-center space-x-2 p-2 w-full animate-accordion-down">
                <Dialog >
                    <DialogTrigger asChild className="cursor-pointer p-1">

                        <button className="bg-[#CFF2FF] text-[#217EFD] hover:bg-[#217EFD] hover:text-[#fff] duration-300  rounded p-1 pr-2 px-2 cursor-pointer flex items-center space-x-2"
                            type="button"
                            onClick={() => setModalConfirmar(true)}
                        >
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 0.75C4.9506 0.75 1.25 4.45137 1.25 9C1.25 13.5486 4.9506 17.25 9.5 17.25C14.0494 17.25 17.75 13.5486 17.75 9C17.75 4.45137 14.0494 0.75 9.5 0.75ZM9.5 16.0988C5.58528 16.0988 2.40116 12.9147 2.40116 9C2.40116 5.08528 5.58528 1.90116 9.5 1.90116C13.4147 1.90116 16.5988 5.08528 16.5988 9C16.5988 12.9147 13.4147 16.0988 9.5 16.0988ZM12.5928 6.80204C12.8177 7.0269 12.8177 7.39146 12.5928 7.61632L9.01114 11.198C8.8991 11.31 8.75175 11.3668 8.6044 11.3668C8.45705 11.3668 8.3097 11.3108 8.19766 11.198L6.40721 9.40752C6.18235 9.18266 6.18235 8.81809 6.40721 8.59323C6.63207 8.36837 6.99661 8.36837 7.22147 8.59323L8.60517 9.97696L11.7793 6.80283C12.0042 6.57797 12.3679 6.57794 12.5928 6.80204Z" fill="currentColor" />
                            </svg>

                            <p>Processar</p>
                        </button>
                    </DialogTrigger>
                    {modalConfirmar && <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                        <DialogHeader className="text-left">
                            <DialogTitle className="text-lg font-semibold text-[#143163]">Processar levantamento</DialogTitle>
                            <DialogDescription className="text-sm text-[#667085]">Confirma que pretende processar este pedido de levantamento?</DialogDescription>
                        </DialogHeader>

                    </DialogContent>}
                </Dialog>

                <Dialog >
                    <DialogTrigger asChild className="cursor-pointer p-1">

                        <button 
                        onClick={() => setModalRecusar(true)}
                        className="bg-[#FDE4EA] text-[#EF4A00] hover:bg-[#EF4A00] hover:text-[#fff] duration-300  p-1 pr-2 px-2 rounded cursor-pointer flex items-center space-x-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.75C4.4506 0.75 0.75 4.45137 0.75 9C0.75 13.5486 4.4506 17.25 9 17.25C13.5494 17.25 17.25 13.5486 17.25 9C17.25 4.45137 13.5494 0.75 9 0.75ZM9 16.0988C5.08528 16.0988 1.90116 12.9147 1.90116 9C1.90116 5.08528 5.08528 1.90116 9 1.90116C12.9147 1.90116 16.0988 5.08528 16.0988 9C16.0988 12.9147 12.9147 16.0988 9 16.0988ZM11.7091 7.10444L9.81349 9L11.7091 10.8956C11.9339 11.1204 11.9339 11.485 11.7091 11.7098C11.597 11.8219 11.4497 11.8787 11.3023 11.8787C11.155 11.8787 11.0076 11.8227 10.8956 11.7098L9 9.81424L7.10442 11.7098C6.99237 11.8219 6.84502 11.8787 6.69767 11.8787C6.55033 11.8787 6.40298 11.8227 6.29093 11.7098C6.06607 11.485 6.06607 11.1204 6.29093 10.8956L8.18651 9L6.29093 7.10444C6.06607 6.87958 6.06607 6.51502 6.29093 6.29016C6.51579 6.0653 6.88033 6.0653 7.10519 6.29016L9.00077 8.18576L10.8964 6.29016C11.1212 6.0653 11.4858 6.0653 11.7106 6.29016C11.9339 6.51502 11.9339 6.88035 11.7091 7.10444Z" fill="currentColor" />
                            </svg>

                            <p>Recusar</p>
                        </button>
                    </DialogTrigger>
                    {modalRecusar && <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                        <DialogHeader className="text-left">
                            <DialogTitle className="text-lg font-semibold text-[#143163]">Recusar levantamento</DialogTitle>
                            <DialogDescription className="text-sm text-[#667085]">Confirma que pretende recusar este pedido de levantamento?</DialogDescription>
                        </DialogHeader>


                    </DialogContent>}
                </Dialog>

            </div>


        </>
    )
}
