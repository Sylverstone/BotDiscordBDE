const convertToDate = (date : string) => 
{
    const [jour, mois, annee] = date.split("/");
    return new Date(`${annee}-${mois}-${jour}`);
}

export default function verifierDate(dateOrigine : string | Date ,NouvelleDate : string | Date )
{
    if(typeof dateOrigine === 'string' && typeof NouvelleDate === 'string'){
    {
        dateOrigine = convertToDate(dateOrigine);
        NouvelleDate = convertToDate(NouvelleDate);
    }
    
    return NouvelleDate > dateOrigine && (NouvelleDate instanceof Date && dateOrigine instanceof Date);
    }
}

export function createDate(date : string)
{
    const [jour, mois, annee] = date.split("/");
    return new Date(`${annee}-${mois}-${jour}`);
}

export function dateToOnlyDate(date : Date)
{
    if(!(date instanceof Date)) return;
    return `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`;
}