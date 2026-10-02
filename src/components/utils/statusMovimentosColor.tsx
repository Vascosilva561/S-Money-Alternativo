export const statusMovimentoColor = (item: any) => {
  const status = String(item ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["concluido", "processada", "aceite", "accepted", "success", "paid"].includes(status)) {
    return "bg-[#CFE7D7] text-[#0D9339]";
  }
  if (["pendente", "pending", "em processamento", "processing"].includes(status)) {
    return "bg-[#FDE9B0] text-[#A26C07]";
  }
  if (["falhou", "rejeitado", "recusado", "rejected", "failed", "error", "cancelado", "cancelled", "canceled"].includes(status)) {
    return "bg-[#FDE4EA] text-[#EF4A00]";
  }

  return null;
}
