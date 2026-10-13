// src/contexts/SelectedAccountContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type SelectedAccount = {
    id: string
    name: string
    accountType: "User" | "Business" | "Merchant"
    level?: number
    first_name:  string
    last_name: string
    email?: string
    nif?: string
    bi_number?: string

    status_validate?: string
    status?: string
    telefone?: string
    role?: string

    business_name?: string
    nif_validated?: boolean
    auth_token?: string
    push_token?: string | null
    merchant_payment_number?: string
    wallet_id?: string
    balance?: string

    level_up?: string

    updated_at?: string
    created_at?: string

    integration?: boolean
    short_name?: string | null

    nro_reference?: string | null
    motivo?: string | null
    responsavel?: string | null

    user_document?: {
        address: string | null
        biBackFile: string | null
        biFrontFile: string | null
        birthday: string | null
        city: string | null
        country: string | null
        selfieFile: string | null
        user: string
        licence_comercial: string | null
        seller_card: string | null
        other_document: string | null
        account_type: string
        province: string | null
        nacionalidade: string | null
        created_at: string
    }
} | null

type SelectedAccountContextType = {
  account: SelectedAccount;
  setAccount: (account: SelectedAccount) => void;
  clearAccount: () => void;
};

const SelectedAccountContext = createContext<SelectedAccountContextType | undefined>(undefined);

export function SelectedAccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccountState] = useState<SelectedAccount>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAccount");
    if (stored) setAccountState(JSON.parse(stored));
  }, []);

  const setAccount = (acc: SelectedAccount) => {
    setAccountState(acc);
    if (acc) sessionStorage.setItem("selectedAccount", JSON.stringify(acc));
    else sessionStorage.removeItem("selectedAccount");
  };

  const clearAccount = () => setAccount(null);

  return (
    <SelectedAccountContext.Provider value={{ account, setAccount, clearAccount }}>
      {children}
    </SelectedAccountContext.Provider>
  );
}

export function useSelectedAccount() {
  const ctx = useContext(SelectedAccountContext);
  if (!ctx) throw new Error("useSelectedAccount deve estar dentro de SelectedAccountProvider");
  return ctx;
}