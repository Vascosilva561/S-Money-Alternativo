import { api } from "@/api"
import type { Products } from "@/types/products"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

type props = {
    setCurrent: (value: number) => void,
    selectedItem: any
}


export default function ListaProdutos({ setCurrent, selectedItem }: props) {

    const [productsData, setProductsData] = useState<Products[]>([])
    const [filteredDataUsers, setFilteredUsersData] = useState<Products[]>([])
    const [searchInput, setSearchInput] = useState("")

    const fetchProducts = async () => {
        if (!selectedItem?.partner_id) return;

        try {
            const { data } = await api.get(`/front/pgs_produtos?partner_id=${selectedItem?.partner_id}&per_page=5000`)
            setProductsData(data?.dados)
            setFilteredUsersData(data?.dados)
            return data
        } catch (error) {
            console.log("erro ao pegar productos ", error)
        }

    }

    const { data, isLoading } = useQuery<Products>({
        queryKey: ["listaDeProdutos", selectedItem?.partner_id],
        queryFn: () => fetchProducts(),
        enabled: !!selectedItem?.partner_id, // executa quando houver de facto o partner_id
        refetchOnWindowFocus: false, 
    })

    // console.log(data)

    function agruparPorSubtipo(produtos: any[]) {
        const grupos: Record<string, any[]> = {};

        produtos.forEach(produto => {
            const nomeLimpo = produto.subtipo?.trim() || "Outro";


            if (!grupos[nomeLimpo]) {
                grupos[nomeLimpo] = [];
            }
            grupos[nomeLimpo].push(produto);
        });

        return grupos;
    }


    useEffect(() => {
        if (Array.isArray(data?.dados) && data?.dados?.length) {
            setProductsData(data?.dados?.slice(0, 5000));
            setFilteredUsersData(data?.dados?.slice(0, 5000)); // Adiciona os dados iniciais
        }
    }, [data]);

    // Função de pesquisa que apenas atualiza o termo de pesquisa
    const handleSearch = (params: string | undefined) => {
        setSearchInput(params?.trim() || "");
    };

    useEffect(() => {
        if (!productsData || productsData?.length === 0) {
            setFilteredUsersData([]);
            return;
        }

        if (!searchInput) {
            setFilteredUsersData(productsData);
            return;
        }

        const normalizedSearch = searchInput?.toLowerCase().trim();

        const filteredProducts = Array.isArray(data?.dados)
            ? data.dados.filter((item) => {
                if (!normalizedSearch) return true;

                const nome = String(item?.nome || '').toLowerCase();
                const valor = String(item?.valor || '').toLowerCase();
                const subtipo = String(item?.subtipo || '').toLowerCase();
                const status = String(item?.status || '').toLowerCase();
                const plataforma = 'pagasó';

                return (
                    nome.includes(normalizedSearch) ||
                    valor.includes(normalizedSearch) ||
                    subtipo.includes(normalizedSearch) ||
                    status.includes(normalizedSearch) ||
                    plataforma.includes(normalizedSearch)
                );
            })
            : [];

        setFilteredUsersData(filteredProducts);

    }, [productsData, searchInput]); // Atualiza ao mudar salesData ou searchTerm

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter" || event.key === 'Backspace') {
            handleSearch(searchInput);
        }
        if (event.target.value) {
            handleSearch(event.target.value);
        }
    };

    const produtosAgrupados = agruparPorSubtipo(Array.isArray(filteredDataUsers) ? filteredDataUsers : []);

    return (
        <div className="w-full p-5 text-[#143163]">

            <button type="button" onClick={() => setCurrent(0)} className="flex space-x-1 items-center text-[#0085FF] cursor-pointer">
                <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4167 7.24827C13.6007 7.24827 13.7847 7.32124 13.9247 7.46824C14.2055 7.76124 14.2055 8.23627 13.9247 8.52927L10.5993 11.9992L13.9247 15.4692C14.2055 15.7622 14.2055 16.2372 13.9247 16.5303C13.6439 16.8233 13.1886 16.8233 12.9078 16.5303L9.0745 12.5303C8.79371 12.2373 8.79371 11.7622 9.0745 11.4692L12.9078 7.46921C13.0487 7.32121 13.2327 7.24827 13.4167 7.24827Z" fill="#0085FF" />
                </svg>

                <p>Voltar</p>
            </button>

            <div className="flex justify-between items-center  mt-10">
                <h1 className="font-semibold text-lg">Lista de Produtos {selectedItem?.name}</h1>
                <div className="bg-white relative block rounded-lg items-center w-[25%]">
                    <svg className="absolute inset-y-2 ml-1 left-0 flex items-center cursor-pointer" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1879 15.9746C15.8264 14.4284 17.5225 10.2257 15.9762 6.5875C14.4298 2.94933 10.2267 1.25343 6.58814 2.79962C2.94961 4.34581 1.25355 8.54857 2.79989 12.1867C4.34623 15.8249 8.54939 17.5208 12.1879 15.9746Z" stroke="#273142" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.4473 14.4486L19.9991 20.0007" stroke="#273142" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>

                    <input type="search" placeholder="Pesquise..."
                        onKeyDown={handleKeyDown} value={searchInput} onChange={(e) => handleSearch(e.target.value)}
                        className="p-2 rounded-[6px] ring-1 ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] w-full focus:outline-none text-sm text-[#8998B1] pl-8" />
                </div>
            </div>

            {isLoading ? 
            <div className=" flex justify-center w-full mt-40">
                <span className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin "></span>
            </div> :
                Object.entries(produtosAgrupados).map(([subtipo, produtos]) => (
                    <div key={subtipo} className="mt-5 rounded-lg ring-1 ring-[#EBECEF] w-full font-semibold ">
                        <div className="bg-[#F5F6FA] p-4 flex items-center w-full rounded-t-lg">
                            <div className="flex items-center space-x-2 w-full">
                                <p>Produto:</p>
                                <p>{subtipo}</p>
                            </div>
                            <p className="w-[35%]">Valor</p>
                        </div>
                        {produtos?.map((produto, key) => (<div className={`flex items-center w-full p-4 hover:bg-[#F8FAFC] duration-300 ${produtos?.length === (key + 1) ? "rounded-b-lg " : "border-b-1 border-b-[#EBECEF]"}`}>
                            <p className="w-full">{produto?.nome} {key}</p>
                            <p className="w-[35%]">{produto?.valor} kz</p>
                        </div>))}
                    </div>
                ))}
        </div>
    )
}