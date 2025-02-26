import { CommandInteraction, EmbedBuilder } from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";
import splitNumber from "./splitHeure.js";

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

export function createDate(date : string) : undefined | Date
{
    let jour : string = "";let mois : string = "";let annee : string = "";
    if(date.includes("/"))
    {
        [jour,mois,annee] = date.split("/");
    }
    else if(date.includes("-"))
    {
        [jour,mois,annee] = date.split("-");
    }
    else
    {
        return undefined
    }
    return new Date(`${annee}-${mois}-${jour}`);
}

export function dateToOnlyDate(date : Date)
{
    if(!(date instanceof Date)) return;
    return `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`;
}

export function setup_date(dateDebut : string, DateFin : string, heureDebut : number, heureFin : number,message : CommandInteraction) : Date[] | null
{
    const dateDebutEvent = createDate(dateDebut);
    const dateFinEvent = createDate(DateFin);
    const [stringHeureDebutInt, stringHeureDebutDecimal] = splitNumber(heureDebut);
    const [stringHeureFintInt, stringHeureFinDecimal] = splitNumber(heureFin);
    if(!(dateDebutEvent instanceof Date && dateFinEvent instanceof Date)) {
        displayEmbedsMessage(message,new EmbedBuilder()
                                            .setTitle("Erreur")
                                            .setDescription("Le format de date que vous avez transmis est incorrect :)")
                            );
        return null;
                                                                                                
    }
    
    dateDebutEvent.setHours(+stringHeureDebutInt,+stringHeureDebutDecimal);
    dateFinEvent.setHours(+stringHeureFintInt,+stringHeureFinDecimal);

    return [dateDebutEvent,dateFinEvent];
}

export function to_date_sql(date : string)
{
    //le separateur doit être ABSOLUMENT "-" ici.
    const [jour,mois,annee] = date.split("-");
    console.log("la date qui doit être transfo",date);
    return `${annee}-${mois}-${jour}`;
    
}
 
export function IsDate(date : string)
{


}