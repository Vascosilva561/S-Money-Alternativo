export const getNationality = (item: any) => {
    if(!item) return "";
    const { bi_number, code_country, country } = item;

    if (!bi_number || !code_country || !country) {
        return "N/A";
    }

    const isAngolan =
        bi_number.length === 14 &&
        code_country === "+244" ||
        country.trim().toLowerCase() === "Angola";

    if (isAngolan) return "Angolana";

    const isForeign =
        code_country !== "+244" ||
        country.trim().toLowerCase() !== "Angola";

    if (isForeign) return "Estrangeira";

    return "Dados inconsistentes";
};