import { AuthContext } from "@/context/auth"
import { useContext } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ACCOUNT_TYPE_OPTIONS, CHANNEL_OPTIONS, filterOptions, SERVICE_OPTIONS, STATUS_OPTIONS, TRANSACTION_TYPE_OPTIONS, type FilterOption } from "@/pages/dashboard";

type Props = {
    activeFilter: FilterOption;
    onFilterClick: (key: FilterOption) => void;
    customRange: { start: string; end: string };
    onCustomRangeChange: (range: { start: string; end: string }) => void;
    transactionType: string;
    onTransactionTypeChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    accountType: string;
    onAccountTypeChange: (value: string) => void;
    service: string;
    onServiceChange: (value: string) => void;
    channel: string;
    onChannelChange: (value: string) => void;
    onClearFilters: () => void;
};

export default function CardOne({
    activeFilter, onFilterClick, customRange, onCustomRangeChange,
    transactionType, onTransactionTypeChange,
    status, onStatusChange,
    accountType, onAccountTypeChange,
    service, onServiceChange,
    channel, onChannelChange,
    onClearFilters,
}: Props) {
    const { user } = useContext(AuthContext)

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 12) return "Bom dia";
        if (hour >= 12 && hour < 18) return "Boa tarde";
        return "Boa noite";
    };


    return (
        <div className="relative px-4 py-2 pt-5 ring-1 ring-[#EEEEEE] rounded-lg text-[rgb(20,49,99)] flex flex-col space-y-2 items-start justify-start duration-300">
            <div className="space-y-1">
                <p className="font-bold text-2xl">{getGreeting()}, {user?.name}</p>
                <p className="text-sm text-[#627AA0]">Acompanhe a operação, liquidez e sinais de risco num só lugar.</p>
            </div>

            <div className="w-full mt-5">
                <div className="flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1713_56056)">
                            <path d="M14 0H6C2.68629 0 0 2.68629 0 6V14C0 17.3137 2.68629 20 6 20H14C17.3137 20 20 17.3137 20 14V6C20 2.68629 17.3137 0 14 0Z" fill="#E2F4FE" />
                            <path d="M5 7H15M7 10H13M9 13H11" stroke="#008CE3" strokeWidth="1.4" strokeLinecap="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1713_56056">
                                <rect width="20" height="20" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <p className="text-sm font-bold">Filtros globais</p>
                </div>

                <div className="w-full mt-4 bg-[#FBFCFE] rounded-lg p-2 ring-1 ring-zinc-200 flex flex-wrap gap-2">
                    {/* Período */}
                    <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1">
                        <p className="text-[10px] text-[#7D8CA6] duration-300">PERÍODO</p>
                        
                        <Select
                            value={activeFilter === "custom" ? "custom" : activeFilter}
                            onValueChange={(value) => onFilterClick(value as FilterOption)}
                        >
                            <SelectTrigger className="border-none h-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {activeFilter === "custom" && (
                            <div className="flex items-center gap-1 pt-1">
                                <input
                                    type="date"
                                    value={customRange.start}
                                    onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
                                    className="text-[11px] outline-none bg-transparent w-full"
                                />
                                <span className="text-[11px]">—</span>
                                <input
                                    type="date"
                                    value={customRange.end}
                                    onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
                                    className="text-[11px] outline-none bg-transparent w-full"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tipo de transação */}
                    <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1">
                        <p className="text-[10px] text-[#7D8CA6] duration-300">TIPO DE TRANSACÇÃO</p>
                        <Select value={transactionType} onValueChange={onTransactionTypeChange}>
                            <SelectTrigger className="border-none h-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TRANSACTION_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Estado */}
                    <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1">
                        <p className="text-[10px] text-[#7D8CA6] duration-300">ESTADO</p>
                        <Select value={status} onValueChange={onStatusChange}>
                            <SelectTrigger className="border-none h-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tipo de conta */}
                    <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1">
                        <p className="text-[10px] text-[#7D8CA6] duration-300">TIPO DE CONTA</p>
                        <Select value={accountType} onValueChange={onAccountTypeChange}>
                            <SelectTrigger className="border-none h-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ACCOUNT_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Serviço */}
                    <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1">
                        <p className="text-[10px] text-[#7D8CA6] duration-300">SERVIÇO</p>
                        <Select value={service} onValueChange={onServiceChange}>
                            <SelectTrigger className="border-none h-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SERVICE_OPTIONS.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Canal */}
                    <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1">
                        <p className="text-[10px] text-[#7D8CA6] duration-300">CANAL</p>
                        <Select value={channel} onValueChange={onChannelChange}>
                            <SelectTrigger className="border-none h-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CHANNEL_OPTIONS.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div
                        onClick={onClearFilters}
                        className="ui-clear-filter-button"
                    >
                        <svg width="10" height="14" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.36009 3.5451V2.10476C4.9652 2.10476 5.53054 2.21839 6.05611 2.44567C6.58452 2.6701 7.04759 2.9826 7.44531 3.38317C7.84588 3.78374 8.15838 4.24822 8.38281 4.77663C8.61009 5.3022 8.72372 5.86612 8.72372 6.46839C8.72372 7.07067 8.61151 7.63601 8.38707 8.16442C8.16264 8.68999 7.85014 9.15305 7.44957 9.55362C7.04901 9.95419 6.58452 10.2681 6.05611 10.4954C5.53054 10.7198 4.9652 10.832 4.36009 10.832C3.75781 10.832 3.19247 10.7198 2.66406 10.4954C2.13849 10.2681 1.67543 9.95419 1.27486 9.55362C0.87429 9.15305 0.560369 8.68999 0.333097 8.16442C0.108665 7.63601 -0.0035511 7.07067 -0.0035511 6.46839L1.43679 6.47266C1.43679 6.87607 1.51065 7.25391 1.65838 7.60618C1.80895 7.95845 2.01918 8.26953 2.28906 8.53942C2.55895 8.80646 2.87003 9.01527 3.2223 9.16584C3.57741 9.31641 3.95668 9.39169 4.36009 9.39169C4.76349 9.39169 5.14276 9.31641 5.49787 9.16584C5.85298 9.01527 6.16406 8.80646 6.43111 8.53942C6.70099 8.26953 6.9098 7.95845 7.05753 7.60618C7.2081 7.25391 7.28338 6.87607 7.28338 6.47266C7.28338 6.06641 7.20668 5.68714 7.05327 5.33487C6.9027 4.97976 6.69389 4.66868 6.42685 4.40163C6.1598 4.13175 5.84872 3.92152 5.49361 3.77095C5.14134 3.62038 4.76349 3.5451 4.36009 3.5451ZM4.55185 5.77805L1.61151 2.88885L4.55185 -0.000355244V5.77805Z" fill="currentColor" />
                        </svg>
                        <p className="text-[12px] font-semibold">Limpar</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
