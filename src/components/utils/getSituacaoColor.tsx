export const statusUserColor = (statusValue: unknown) => {
  const status = String(statusValue ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["active", "activo", "activa", "enabled", "ativo", "ativa"].includes(status)) {
    return "bg-[#CFE7D7] text-[#0D9339]";
  }
  if (status.includes("inactiv") || status.includes("inativ") || status.includes("desactiv") || status.includes("desativ") || status === "disabled") {
    return "bg-[#8E8E8E19] text-[#575757]";
  }
  if (status.includes("blocked") || status.includes("bloque") || status.includes("suspend")) {
    return "bg-[#FDE4EA] text-[#EF4A00]";
  }

  return null;
}
