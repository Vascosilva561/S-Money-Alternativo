import paises from "../json/paises.json"


export const getCountries = async () => {
        return Promise.resolve(paises); // Garante que seja uma Promise
    }