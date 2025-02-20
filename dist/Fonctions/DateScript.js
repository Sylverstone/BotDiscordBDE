const convertToDate = (date) => {
    const [jour, mois, annee] = date.split("/");
    return new Date(`${annee}-${mois}-${jour}`);
};
export default function verifierDate(dateOrigine, NouvelleDate) {
    if (typeof dateOrigine === 'string' && typeof NouvelleDate === 'string') {
        {
            dateOrigine = convertToDate(dateOrigine);
            NouvelleDate = convertToDate(NouvelleDate);
        }
        return NouvelleDate > dateOrigine && (NouvelleDate instanceof Date && dateOrigine instanceof Date);
    }
}
export function createDate(date) {
    let jour = "";
    let mois = "";
    let annee = "";
    if (date.includes("/")) {
        [jour, mois, annee] = date.split("/");
    }
    else if (date.includes("-")) {
        [jour, mois, annee] = date.split("-");
    }
    else {
        return undefined;
    }
    return new Date(`${annee}-${mois}-${jour}`);
}
export function dateToOnlyDate(date) {
    if (!(date instanceof Date))
        return;
    return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
