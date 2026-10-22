import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import AdmConfiguracoes from "@/components/utils/direcao/admConfig"
import DetailsMerchant from "@/components/ConfigsMerchants/detailsGPO"
import EditGpoMerchant from "@/components/ConfigsMerchants/configGPO"
import { getGpoConfigurationPresentation, isGpoConfigured } from "@/components/ConfigsMerchants/gpoStatus"


export interface MerchantUserDocument {
    address: string | null;
    biBackFile: string | null;
    biFrontFile: string | null;
    birthday: string | null;
    city: string | null;
    country: string | null;
    selfieFile: string | null;
    user: string;
    licence_comercial: string | null;
    seller_card: string | null;
    other_document: string | null;
    account_type: string | null;
    province: string | null;
    nacionalidade: string | null;
    created_at: string;
}

export interface MerchantServiceAccount {
    id: string | null;
    name: string | null;
    status: string | null;
    permissions: string[] | null;
}

export interface MerchantUser {
    id: string;
    email: string;
    business_name: string;
    nif: string | null;
    nif_validated: boolean;
    auth_token: string | null;
    push_token: string | null;
    phone_number: string | null;
    merchant_payment_number: string | null;
    wallet_id: string | null;
    balance: number;
    wallet_balance: number;
    balance_integration: number;
    status: string | null;
    updated_at: string;
    created_at: string;
    account_type: string | null;
    level: number | null;
    level_up: string | null;
    status_validate: string | null;
    user_document: MerchantUserDocument;
    motivo: string | null;
    responsavel: string | null;
    nro_reference: string | null;
    integration: boolean;
    short_name: string | null;
    gpo_status: string | null;
    gpo_min_amount_per_trx: number | null;
    gpo_max_amount_per_trx: number | null;
    gpo_billing: number | null;
    service_accounts?: MerchantServiceAccount[] | null;
}

export interface MerchantsResponse {
    dados: MerchantUser[];
    total: number;
}

export default function ConfiguracoesGPO({ embedded = false }: { embedded?: boolean } = {}) {

    const perPage = 50
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [addPoolModalIsOpen, setAddPoolModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [itemSelectedMerchant, setItemSelectedMerchant] = useState<MerchantUser | null>(null)

    const [queryParams, _setQueryParams] = useState({
        title: "",
        active: true,
        start_date: "",
        end_date: "",
        status: ""
    })


    const [isFiltered, _setIsFiltered] = useState(false) // estado para verificar se há filtro

    async function getMerchants(page: number) {
        try {
            const url = "/front/merchants"

            const urlUserBackoffice = isFiltered
                ? `${url}?per_page=${perPage}&page=${page}&${new URLSearchParams({
                    title: queryParams?.title,
                    active: String(queryParams?.active),
                    start_date: queryParams?.start_date,
                    end_date: queryParams?.end_date
                }).toString()}`
                : `${url}?per_page=${perPage}&page=${page}`

            const { data } = await api.get(urlUserBackoffice)

            return data
        } catch (error) {
            console.log("erro ao fazer busca ", error)
        }
    }


    const {
        data: merchantsData,
        isLoading: isLoadingMerchants,
        isFetching: isFetchingMerchants,
        refetch: refetchMerchants,
    } = useQuery<MerchantsResponse>({
        queryKey: ["ListaDeMerchants", currentPage, perPage, isFiltered],
        queryFn: () => getMerchants(currentPage),
        placeholderData: keepPreviousData,
    })


    // Função de pesquisa que apenas atualiza o termo de pesquisa
    const handleSearch = (params: string | undefined) => {
        // Permite espaços no meio, mas evita strings só com espaços
        if (params && params.trim().length > 0) {
            setSearchInput(params);
        } else {
            setSearchInput(params || "");
        }
    };



    const filteredMerchants = useMemo<MerchantUser[]>(() => {
        const lista = merchantsData?.dados ?? [];
        const normalizedSearch = searchInput?.toLowerCase().trim() ?? "";

        if (!normalizedSearch) return lista;

        return lista?.filter((item: MerchantUser) => {
            const searchableFields = [
                item.id,
                item.email,
                item.business_name,
                item.nif,
                item.phone_number,
                item.merchant_payment_number,
                item.status,
                item.account_type,
                item.status_validate,
                item.short_name,
                item.user_document?.city,
                item.user_document?.province,
                item.user_document?.country,
                item.user_document?.nacionalidade,
            ];

            return searchableFields.some((field) =>
                String(field ?? "")
                    .toLowerCase()
                    .includes(normalizedSearch)
            );
        });
    }, [merchantsData, searchInput]);


    const handleKeyDown = (event: any) => {
        if (event.key === "Enter" || event.key === 'Backspace') {
            handleSearch(searchInput);
        }
        if (event.target.value) {
            handleSearch(event.target.value);
        }
    };

    const generatePaginationRange = (totalPages: number, currentPage: number): (number | string)[] => {
        const delta = 2; // Mostra 2 páginas antes e depois da atual
        const range: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                range.push('...');
            }
        }

        return range;
    };

    const totalItems = merchantsData?.total ?? 0;

    const totalPages = Math.ceil(totalItems / Number(perPage))
    const paginationRange = generatePaginationRange(totalPages, currentPage);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) setCurrentPage(page);
    };

    const handleNextPage = async () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = async () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };


    return (
        <>

            {/* modais */}
            {/* <EditConfigGPO itemSelected={itemSelectedMerchant} onClose={() => setEditModalIsOpen(false)} isOpen={editModalIsOpen} /> */}
            <EditGpoMerchant
                onClose={() => setAddPoolModalIsOpen(false)}
                isOpen={addPoolModalIsOpen}
                itemSelected={itemSelectedMerchant}
            />
            <DetailsMerchant
                itemSelected={
                    itemSelectedMerchant
                }

                onClose={() => setDetailsModalIsOpen(false)}
                isOpen={detailsModalIsOpen}
            />

            {!embedded && <AdmConfiguracoes page={"Config. GPO"} />}

            <div className={embedded ? "w-full min-w-0" : "ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2 border-[#C8D7EF]"}>
                <div className="overflow-hidden relative w-full h-auto">


                    <div className="ui-data-stack w-full flex min-w-0 flex-col gap-4 p-4 sm:p-5 lg:p-6">
                        <div className="ui-toolbar flex w-full flex-wrap items-center justify-between gap-3 pb-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <RefreshButton
                                    onRefresh={() => { void refetchMerchants() }}
                                    isLoading={isFetchingMerchants}
                                />
                            </div>

                            <div className="ml-auto flex w-full items-center text-[#143163] sm:w-auto">
                                <div className="flex justify-between space-x-4 items-center text-[#143163]">
                                    <div className="relative block w-full rounded-lg sm:w-[300px]">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" aria-hidden="true" />
                                        <Input type="search" placeholder="Pesquise..." onKeyDown={handleKeyDown} value={searchInput} onChange={(e) => handleSearch(e.target.value)} className="h-10 w-full pl-8 pr-10" />
                                        {searchInput && <button type="button" aria-label="Limpar pesquisa" onClick={() => handleSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#8293AE] hover:bg-[#F1F5FA] hover:text-[#143163]"><X className="size-4" aria-hidden="true" /></button>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabela */}



                        <TableResults
                            label="Empresas encontradas"
                            visibleCount={filteredMerchants.length}
                            totalCount={merchantsData?.total}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPreviousPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            isLoading={isLoadingMerchants || isFetchingMerchants}
                            containerClassName="relative overflow-x-auto rounded-xl border border-[#E5EBF4]"
                        >
                            <table className="w-full min-w-[960px] border-collapse text-sm">
                                <thead className="h-12 bg-[#F5F6FA] text-xs font-semibold text-[#143163]">
                                    <tr className="place-items-center text-[#143163]">
                                        <th className="px-4 py-3 text-start">Comerciante</th>
                                        <th className="px-4 py-3 text-start">Contacto</th>
                                        <th className="px-4 py-3 text-start">NIF</th>
                                        <th className="px-4 py-3 text-start">Nº do comerciante</th>
                                        <th className="px-4 py-3 text-start">GPO configurado?</th>
                                        <th className="px-4 py-3 text-start">Estado da configuração</th>
                                        <th className="px-4 py-3 text-center">Ações</th>
                                    </tr>
                                </thead>

                                <tbody className="text-[#143163]">
                                    {isLoadingMerchants ? (
                                        <TableStateRow colSpan={7} state="loading" message="A carregar comerciantes..." />
                                    ) : filteredMerchants?.length > 0 ? (
                                        filteredMerchants?.map((item: MerchantUser) => (
                                            <tr
                                                key={item.id}
                                                className="border-t border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] transition-colors hover:bg-[#F1F6FC]"
                                            >
                                                {/* Comerciante */}
                                                <td className="px-4 py-3 text-start">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">
                                                            {item.business_name || "-"}
                                                        </span>

                                                        <span className="text-xs text-[#8998B1]">
                                                            {item.email || "-"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Contacto */}
                                                <td className="px-4 py-3 text-start">
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {item.phone_number || "-"}
                                                        </span>

                                                        <span className="text-xs text-[#8998B1]">
                                                            {item.user_document?.city || "-"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* NIF */}
                                                <td className="px-4 py-3 text-start">
                                                    {item.nif || "-"}
                                                </td>

                                                {/* Nº do comerciante */}
                                                <td className="px-4 py-3 text-start">
                                                    {item.merchant_payment_number || "-"}
                                                </td>

                                                {/* Configurado */}
                                                <td className="px-4 py-3 text-start">
                                                    <span
                                                        className={`ui-status-tag ${isGpoConfigured(item.gpo_min_amount_per_trx, item.gpo_max_amount_per_trx) ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#F3F4F6] text-[#374151]"}`}
                                                    >
                                                        {isGpoConfigured(item.gpo_min_amount_per_trx, item.gpo_max_amount_per_trx) ? "Sim" : "Não"}
                                                    </span>
                                                </td>

                                                {/* Estado da configuração GPO */}
                                                <td className="px-4 py-3 text-start">
                                                    <span className={`ui-status-tag ${getGpoConfigurationPresentation(item.gpo_status).className}`}>
                                                        {getGpoConfigurationPresentation(item.gpo_status).label}
                                                    </span>
                                                </td>

                                                {/* Detalhes */}
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <TableActionButton
                                                            action="view"
                                                            onClick={() => {
                                                                setItemSelectedMerchant(item)
                                                                setDetailsModalIsOpen(true)
                                                            }}
                                                        />
                                                        <TableActionButton
                                                            action="edit"
                                                            onClick={() => {
                                                                setItemSelectedMerchant(item)
                                                                setAddPoolModalIsOpen(true)
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableStateRow colSpan={7} state="empty" message="Nenhum comerciante encontrado." />
                                    )}
                                </tbody>
                            </table>
                        </TableResults>


                        {/* paginacao */}

                        <PaginationFooter
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginationRange={paginationRange}
                            onPageChange={handlePageChange}
                            onPreviousPage={handlePrevPage}
                            onNextPage={handleNextPage}
                        />


                    </div>
                </div>
            </div>
        </>
    )
}
