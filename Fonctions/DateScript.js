const convertToDate = (date) => {
    const [jour, mois, annee] = date.split("/");
    const dateOrigine = jour+"/"+mois+"/"+annee;
    return new Date(`${annee}-${mois}-${jour}`);
}
export default function verifierDate(dateOrigine,NouvelleDate)
{
    dateOrigine = convertToDate(dateOrigine);
    NouvelleDate = convertToDate(NouvelleDate);
    return NouvelleDate > dateOrigine && (NouvelleDate instanceof Date && dateOrigine instanceof Date);
}