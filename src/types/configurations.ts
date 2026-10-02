export type ProgramaIndicacao = {
    id: string,
    name: string
    description: string
    start_date: string
    end_date: string
    reward_amount: number
    budget: number
    active: boolean,
    created_at: string,
    updated_at: string
}

export type ConfigTypeResponse = {
    dados: ProgramaIndicacao[],
    total: number
}