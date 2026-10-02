


type props = {
    onClose: () => void,
    TransactionData: any,
    setDetalhesTransferencia: (e: any) => void,
    transferir: (e: any) => void,
    loading: boolean,
    setStep: (value: number) => void;
    step: number,
    setPIN: (value:string) => void;
    PIN: string
}

export default function DetalhesTransferencia({ PIN, setPIN, step, setStep, TransactionData, setDetalhesTransferencia, transferir, loading }: props) {

    return (
        <div>
            {step === 1 &&
                <>
                    <button type="button" onClick={() => setDetalhesTransferencia(false)}
                        className=" flex items-center space-x-1 cursor-pointer pr-2 pl-1 py-1 rounded-full bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] 
                text-[#143163] font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        <p className="text-sm">Voltar</p>
                    </button>
                    <div className="spce-y-4 mt-6">
                        <p className="text-[#143163] mb-4 font-semibold">Detalhes da Transferência</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full"></div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between w-full items-center">
                            <p className="text-[#143163]">Remetente:</p>
                            <p className="text-[#4B5563]">{TransactionData?.origem}</p>
                        </div>
                        <div className="flex justify-between w-full items-center">
                            <p className="text-[#143163]">Destinatário:</p>
                            <p className="text-[#4B5563]">{TransactionData?.destino}</p>
                        </div>
                        <div className="flex justify-between w-full items-center">
                            <p className="text-[#143163]">Valor da Transação:</p>
                            <p className="text-[#4B5563]">{Number(TransactionData?.valor)?.toLocaleString("pt-PT") + " Kz"}</p>
                        </div>
                        <div className="flex justify-between w-full items-center">
                            <p className="text-[#143163]">Taxa/Comissão:</p>
                            <p className="text-[#4B5563]">N/A</p>
                        </div>
                        <div className="flex justify-between w-full items-center">
                            <p className="text-[#143163]">Descrição da Operação:</p>
                            <p className="text-[#4B5563] text-end">{TransactionData?.descricao}</p>
                        </div>
                    </div>

                    <button disabled={loading ? true : false} className=" w-full p-2 mt-[60px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                        onClick={() => setStep(2)}
                        type="button">
                        {loading ?
                            <div className="flex justify-center items-center">
                                <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                            </div> : "Transferir"
                        }
                    </button>

                </>
            }
            {step === 2 && <div className="mt-5">
                <div className="flex flex-col space-y-2 mt-6">
                    <label className="text-[#143163] font-semibold text-[14px]">PIN</label>
                    <input required type="text" value={PIN} onChange={(e) => setPIN(e.target.value)}
                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                </div>
                <button disabled={loading ? true : false} className=" w-full p-2 mt-[60px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                        onClick={transferir}
                        type="button">
                        {loading ?
                            <div className="flex justify-center items-center">
                                <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                            </div> : "Transferir"
                        }
                    </button>
            </div>}
        </div>
    )
}