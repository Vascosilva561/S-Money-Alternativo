export function getInitials(fullname: string): string {
    if(!fullname){
        return "";
    } 

    const partes = fullname?.trim()?.split(/\s+/);
    if (partes?.length < 2) return partes[0][0]?.toUpperCase(); // Se houver apenas um nome, retorna só a inicial

    return `${partes[0][0]?.toUpperCase()}${partes[partes?.length - 1][0]?.toUpperCase()}`;
}