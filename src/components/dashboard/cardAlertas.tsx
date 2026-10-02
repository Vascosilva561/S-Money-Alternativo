import { useNavigate } from "react-router"



export default function CardAlertas() {

    const navigation = useNavigate()

    return (
        <div className="relative px-4 py-2 ring-1 ring-[#EEEEEE] rounded-lg text-[rgb(20,49,99)] 
                        flex flex-col space-y-2 items-start justify-start  
                        duration-300">

            <div className="w-full mt-5">
                <div className="">
                    <p className="text-lg font-bold">Alertas operacionais e financeiros</p>
                </div>
                <div className="flex justify-between  w-full mt-5">
                    <p>
                        Prioridades que requerem atenção
                    </p>
                    <div className="text-[15px] flex items-center space-x-2 bg-[#F9F9F9] rounded-full text-[#808080] px-3 py-1">
                        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3.5" cy="3.5" r="3.5" fill="#808080" />
                        </svg>

                        <p>3 alertas activos</p>
                    </div>
                </div>
                <div className="space-y-2 mt-4">
                    <div className="bg-[#FFF2F2] flex items-center justify-between p-2 rounded  text-[11px]">
                        <div className="flex items-center space-x-2 text-[#D62929]">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="4" cy="4" r="4" fill="#D62929" />
                            </svg>
                            <p className="bg-[#FFCACAA6] text-[#D62929] p-2 rounded text-[9px] h-5 flex justify-center font-bold items-center">CRÍTICO</p>
                            <p className="text-[#333D4A] ">35 transacções pendentes há mais de 10 min</p>
                        </div>

                        <div className="flex items-center space-x-2 text-[#D62929] cursor-pointer hover:underline w-fit">
                            <p className="">Abrir transacções</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-arrow-right-icon lucide-arrow-right "><path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-[#FFF9EB] flex items-center justify-between p-2 rounded  text-[11px]">
                        <div className="flex items-center space-x-2 text-[#BA7308]">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="4" cy="4" r="4" fill="#BA7308" />
                            </svg>
                            <p className="bg-[#FFD797A6] text-[#BA7308] p-2 rounded text-[9px] h-5 flex justify-center font-bold items-center">CRÌTICO</p>
                            <p className="text-[#333D4A] ">Integração KYC degradada: 94,2% de sucesso / 3,8 s</p>
                        </div>

                        <div className="flex items-center space-x-2 text-[#BA7308] cursor-pointer hover:underline w-fit">
                            <p className="">Ver integração</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-arrow-right-icon lucide-arrow-right "><path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-[#E8F7FF] flex items-center justify-between p-2 rounded  text-[11px]">
                        <div className="flex items-center space-x-2 text-[#2678F2]">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="4" cy="4" r="4" fill="#2678F2" />
                            </svg>
                            <p className="bg-[#CDE1FF] text-[#2678F2] p-2 rounded text-[9px] h-5 flex justify-center font-bold items-center">CRÌTICO</p>
                            <p className="text-[#333D4A] ">Levantamentos acima do limiar esperado</p>
                        </div>

                        <div className="flex items-center space-x-2 text-[#2678F2] cursor-pointer hover:underline w-fit">
                            <p className="" onClick={()=>navigation("/levantamentos")}>Ir para levantamentos</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-arrow-right-icon lucide-arrow-right "><path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
