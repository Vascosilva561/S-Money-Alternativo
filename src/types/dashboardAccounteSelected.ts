
export interface DashboardPeriod {
    inicio: string;
    fim: string;
    group_by: string;
    total_pagamentos_valor_periodo: number;
    total_pagamentos_quantidade_periodo: number;
}

export interface SectorPeriod extends DashboardPeriod {
    total_referencias_periodo: number;
}

export interface SectorChartItem {
    date: string;
    referencias_geradas: number;
    pagamentos_valor: number;
    pagamentos_quantidade: number;
}

export interface GPOChartItem {
    date: string;
    pagamentos_valor: number;
    pagamentos_quantidade: number;
}

export interface SectorDashboard {
    total_referencias_geradas_hoje: number;
    total_referencias_geradas: number;
    total_pagamentos_dia: number;
    quantidade_pagamentos_dia: number;
    total_pagamentos_mensal: number;
    quantidade_pagamentos_mensal: number;
    periodo: SectorPeriod;
    dados: SectorChartItem[];
}

export interface GPODashboard {
    total_pagamentos_dia: number;
    quantidade_pagamentos_dia: number;
    total_pagamentos_mensal: number;
    quantidade_pagamentos_mensal: number;
    total_pagamentos_geral: number;
    quantidade_pagamentos_geral: number;
    periodo: DashboardPeriod;
    dados: GPOChartItem[];
}

export interface DashboardResponse {
    sector: SectorDashboard;
    gpo: GPODashboard;
}
