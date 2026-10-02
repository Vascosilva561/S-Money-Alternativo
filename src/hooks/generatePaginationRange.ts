 export const generatePaginationRange = (totalPages: number, currentPage: number): (number | string)[] => {
        const delta = 2; // Mostra 2 páginas antes e depois da atual
        const range: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1   
            ) {
                range.push('...');
            }
        }

        return range;
    };