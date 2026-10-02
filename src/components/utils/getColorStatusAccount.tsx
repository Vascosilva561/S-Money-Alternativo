function normalizeStatus(status: unknown) {
  return String(status ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
}

export const statusAccount = (statusValidate: unknown) => {
  const status = normalizeStatus(statusValidate)

  if (status.includes("rejeit") || status.includes("reject") || status.includes("denied")) {
    return "bg-[#FDE4EA] text-[#EF4A00]"
  }
  if (status.includes("nao valid") || status.includes("not valid") || status.includes("unvalid") || status.includes("invalid") || status.includes("pend") || status.includes("por validar")) {
    return "bg-[#FDE9B0] text-[#A26C07]"
  }
  if (status.includes("valid") || status.includes("verif")) {
    return "bg-[#DDEAFE] text-[#035AAA]"
  }
  if (status.includes("approv") || status.includes("accept")) {
    return "bg-[#CFE7D7] text-[#0D9339]"
  }

  return null
}
