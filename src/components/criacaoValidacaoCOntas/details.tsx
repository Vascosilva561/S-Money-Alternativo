import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"
import { useState } from "react"

import { getInitials } from "../utils/getInitials"
import DadosSubmetidos from "./dadosSubmetidos"
import { statusAccount } from "../utils/getColorStatusAccount"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetailsUsuario({ onClose, isOpen, itemSelected }: props) {

    const [dadosUser, setDadosUser] = useState(true)  // estado do formulario, para dados do formulario ou submissao de documentos
    console.log(itemSelected)

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none" >
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Consulte as informações e o estado deste registo.">Detalhes do utilizador</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                            <svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="25" height="25" rx="8" />
                                <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                            </svg>
                        </SheetClose>
                    </div>

                    <div className="">
                        <div className="ui-modal-tabs flex space-x-1.5 mt-5 pr-1 pl-1">
                            <button
                                onClick={() => setDadosUser(true)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer ${dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[12px] p-2 ring-1 ring-[#A9B8CF]`}>Detalhes do utilizador</button>
                            <button
                                onClick={() => setDadosUser(false)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer ${!dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[12px] p-2 ring-1 ring-[#A9B8CF]`}>Documentos Submetidos</button>

                        </div>
                    </div>

                    {dadosUser ? <div className="space-y-5">
                        <div className="grid place-items-center ">
                            <div className="hidden lg:flex rounded-full border-2 w-12 h-12 items-center justify-center">
                                {getInitials(itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : `${itemSelected?.business_name}`)}
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[#143163] font-semibold">{itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : `${itemSelected?.business_name}`}</p>
                                <p className="text-[#4B5563] text-sm ">{itemSelected?.account_type === "User" ? "Conta Particular" : "Conta Empresa"}</p>
                            </div>
                        </div>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full"></div>

                        <p className="text-[#143163] font-semibold pt-2">Informações do utilizador</p>

                        <div className="w-full">
                            <div className="text-sm text-[#143163]">
                                <div className="w-full flex justify-between items-center">
                                    <p>{itemSelected?.account_type === "User"?"Utilizador:":"Empresa"}</p>
                                    <p className="h-5 font-semibold">{itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : `${itemSelected?.business_name}`}</p>
                                </div>
                                {itemSelected?.account_type === "User" &&<div className="w-full flex justify-between items-center">
                                    <p>Data de nascimento:</p>
                                    <p className="h-5">{itemSelected?.created_at ? (new Date(itemSelected.created_at)).toLocaleDateString('pt-BR') : ''}</p>
                                </div>}
                                {itemSelected?.account_type !== "User" &&
                                <div className="w-full flex justify-between items-center">
                                    <p>Email:</p>
                                    <p className="h-5 font-semibold">{itemSelected?.email}</p>
                                </div>}
                                <div className="w-full flex justify-between items-center">
                                    <p>Número de Telemóvel:</p>
                                    <p className="h-5 font-semibold">{itemSelected?.phone_number}</p>
                                </div>
                                {itemSelected?.account_type ==="User"&&
                                <div className="w-full flex justify-between items-center">
                                    <p>Nacionalidade:</p>
                                    <p className="h-5">{itemSelected?.user_document?.nacionalidade}</p>
                                </div>}
                                {itemSelected?.account_type === "User" ?<div className="w-full flex justify-between items-center">
                                    <p>Documento de identificação:</p>
                                    <p className="h-5 font-semibold">{itemSelected?.bi_number}</p>
                                </div>:
                                <div className="w-full flex justify-between items-center">
                                    <p>NIF</p>
                                    <p className="h-5 font-semibold">{itemSelected?.nif}</p>
                                </div>
                                }
                                {itemSelected?.account_type ==="User"&&
                                <div className="w-full flex justify-between items-center">
                                <p>País:</p>
                                 <p className="h-5">{itemSelected?.user_document?.country}</p>
                                </div>}
                                 <div className="w-full flex justify-between items-center">
                                <p>Província:</p>
                                 <p className="h-5">{itemSelected?.user_document?.province}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                <p>Município:</p>
                                <p className="h-5">{itemSelected?.user_document?.city}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                <p>{itemSelected?.account_type ==="User"?"Morada:":"Endereço da Sede:"}</p>
                                <p className="h-5">{itemSelected?.user_document?.address}</p>
                                </div>
                            </div>
                            
                        </div>

                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full"></div>

                        <p className="text-[#143163] font-semibold pt-2">Informações da Conta</p>

                        <div className="w-full flex justify-between">
                            <div className="text-sm text-[#143163]">
                                <p>Data de Criação:</p>
                                <p>Estado da Conta:</p>
                                {itemSelected?.status_validate==="Validado"&&
                                <>
                                    <p>Responsável pela validação:</p>
                                    <p>Validada em:</p>
                                </>}
                                {itemSelected?.status_validate==="Rejeitado"&&
                                <>
                                    <p>Responsável pela validação:</p>
                                    <p>Recusado em:</p>
                                    <p>Motivo:</p>
                                </>}
                            </div>
                            <div className="text-sm text-[#4B5563]">
                                
                                <p className="h-5 text-end">{itemSelected?.created_at ? (new Date(itemSelected.created_at)).toLocaleDateString('pt-BR') : ''}</p>
                                <p className="w-full flex justify-end ">
                                    <span className={`ui-status-tag ${statusAccount(itemSelected?.status_validate)}`}>
                                    {itemSelected?.status_validate}</span>
                                </p>
                                {itemSelected?.status_validate==="Validado"&&
                                <>
                                    <p className="h-5 text-end">{itemSelected?.responsavel} </p>
                                    <p className="h-5 text-end">{itemSelected?.updated_at ? (new Date(itemSelected?.updated_at)).toLocaleDateString('pt-BR') : ''}</p>
                                </>}
                                {itemSelected?.status_validate==="Pendente"&&
                                <>
                                    <p className="h-5 text-end">{itemSelected?.responsavel} </p>
                                    {/* <p className="h-5 text-end">{itemSelected?.created_at ? (new Date(itemSelected?.created_at)).toLocaleDateString('pt-BR') : ''}</p> */}
                                </>}
                                {itemSelected?.status_validate==="Rejeitado"&&
                                <>
                                    <p className="h-5 text-end">{itemSelected?.responsavel} </p>
                                     <p className="h-5 text-end">{itemSelected?.updated_at ? (new Date(itemSelected?.updated_at)).toLocaleDateString('pt-BR') : ''}</p>
                                    <p className="h-5">{itemSelected?.motivo}</p>
                                </>
                                }
                            </div>
                        </div>
                        <Button onClick={onClose} className=" w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                            type="button" variant="brand">
                            Concluído
                        </Button>
                    </div> : <DadosSubmetidos
                        level_up={itemSelected?.level_up}
                        typeAccount={itemSelected?.account_type}
                        onClose={onClose}
                        idUser={itemSelected?.id}
                        statusAccount={itemSelected?.status_validate}
                        biBack={itemSelected?.user_document?.biBackFile}
                        biFront={itemSelected?.user_document?.biFrontFile}
                        selfie={itemSelected?.user_document?.selfieFile}
                        nacionalidade={itemSelected?.user_document?.nacionalidade}
                    />}
                </SheetContent>

            </Sheet>
        </>
    )
}
