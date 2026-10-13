export interface IndicatorUser {
    name: string
    phone_number: string
    email: string | null
    invite_code: string
}

export interface Indicator {
    id: string
    value_indicator: string
    value_indicated: string
    active: boolean
    created_at: string
    updated_at: string
    user: IndicatorUser
    invite_code: string
}

export interface IndicatorsResponse {
    dados: Indicator[], 
    total: number
}