
export const tipo_de_Terminal = [
    {
        description: "Pagamento Automático (POS)",
        value: "B",
    },
    {
        description: "ATM",
        value: "A",
    },
    {
        description: "Internet Banking (IB)",
        value: "L",
    },
    {
        description: "Express",
        value: "M",
    },
    {
        description: "POS Digital",
        value: "Z",
    },
];


export const CanalDescription = (canal: any) => {
    
    if (!canal) return "";

    const canalFIltered: { description: string, value: string } = tipo_de_Terminal?.find((terminal) => terminal?.value === canal) || { description: "", value: "" }

    return canalFIltered?.description || ""

}