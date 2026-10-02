export type Campanha= {
  id: string;
  title: string;
  description: string;
  start_date: string; // formato: "YYYY-MM-DD"
  end_date: string;   // formato: "YYYY-MM-DD"
  reward_amount: string; // valor numérico em string
  budget: string;        // valor numérico em string
  active: boolean;
  total_distributed_rewards: string;
  remaining_budget: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601,
  invite_code: string,
  user_promoter: {
    first_name: string,
    last_name: string,
    business_name: string
  }
}

export type CampanhasResponse = {
  dados: Campanha[];
  total: number;
}