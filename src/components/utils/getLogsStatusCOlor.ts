export const StatusLogsColor = (status_validate: string) => {
  const status = String(status_validate ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["sucesso", "success", "completed", "concluido"].includes(status)) {
    return "bg-[#CFE7D7] text-[#0D9339]";
  }
  if (["pendente", "pending", "processing"].includes(status)) {
    return "bg-[#FDE9B0] text-[#A26C07]";
  }
  if (["falha", "falhou", "failed", "error", "rejected"].includes(status)) {
    return "bg-[#FDE4EA] text-[#EF4A00]";
  }

  return null;
}
