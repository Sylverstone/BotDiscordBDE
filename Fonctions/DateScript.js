const convertToDate = (date) => {
    const [jour, mois, annee] = date.split("/");
    const dateOrigine = jour+"/"+mois+"/"+annee;
    return new Date(`${annee}-${mois}-${jour}`);
}
export default function verifierDate(dateOrigine,NouvelleDate,alreadyConverted = false)
{
    if(!alreadyConverted)
    {
        dateOrigine = convertToDate(dateOrigine);
        NouvelleDate = convertToDate(NouvelleDate);
    }
    
    return NouvelleDate > dateOrigine && (NouvelleDate instanceof Date && dateOrigine instanceof Date);
}

export function createDate(date)
{
    const [jour, mois, annee] = date.split("/");
    return new Date(`${annee}-${mois}-${jour}`);
}

export function dateToOnlyDate(date)
{
    if(!(date instanceof Date)) return;
    return `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`;
}