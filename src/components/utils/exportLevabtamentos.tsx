import * as XLSX from "xlsx";

export function exportarExcel<T extends object>(
  dados: T[],
  nomeArquivo: string,
  nomeFolha = "Dados"
) {
  if (!dados.length) {
    alert("Não existem dados para exportar.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    nomeFolha
  );

  XLSX.writeFile(workbook, `${nomeArquivo}.xlsx`);
}