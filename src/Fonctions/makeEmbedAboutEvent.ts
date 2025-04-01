import { EmbedBuilder } from "discord.js";
import CBot from "../Class/CBot";
import { EVentType } from "../Enum/EventType.js";
import splitNumber from "./splitHeure.js";
import { NodeModuleEmitKind } from "ts-node";

const decimalPartToStr = (decimalPart: number): string => 
{
    if(decimalPart < 10)
        return "0" + decimalPart.toString();
    return decimalPart.toString();
}

type jour_t = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" ;
type mois_t = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

const is_mois_t = (str : string): str is mois_t =>
{
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].includes(str);
}
const is_jour_t = (str : string): str is jour_t =>
{
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(str);
}

type mois_t_fr = "Janvier" | "Février" | "Mars" | "Avril" | "Mai" | "Juin" | "Juillet" | "Aout" | "Septembre" |
"Octobre" | "Novembre" | "Decembre";

const mapJourEnToJourFr : Map<jour_t,string> = new Map([
    ["Mon","Lundi"],
    ["Tue","Mardi"],
    ["Wed", "Mercredi"],
    ["Thu", "Jeudi"],
    ["Fri", "Vendredi"],
    ["Sat", "Samedi"],
    ["Sun", "Dimanche"]  
])

const mapMoisEnToMoisFr : Map<mois_t,mois_t_fr> = new Map([
    ["Jan","Janvier"],
    ["Feb","Février"],
    ["Mar","Mars"],
    ["Apr","Avril"],
    ["May","Mai"],
    ["Jun","Juin"],
    ["Jul","Juillet"],
    ["Aug","Aout"],
    ["Sep","Septembre"],
    ["Oct","Octobre"],
    ["Nov","Novembre"],
    ["Dec","Decembre"]
])

export const displayDate = (date : Date): string | undefined =>
{
    const dateData = date.toDateString().split(" ");
    const jour = dateData[0];
    const mois = dateData[1];
    const num = +dateData[2];
    const annee = +dateData[3];
    if(!(is_jour_t(jour) && is_mois_t(mois)) ) return;
    const newJour = mapJourEnToJourFr.get(jour);
    const newMois = mapMoisEnToMoisFr.get(mois);

    if(new Date().toDateString() !== date.toDateString())
        return `${newJour} ${num} ${newMois}`;
    return "Aujourd'hui";
}

export default function makeEmbedABoutEvent(bot : CBot, typeEnv : EVentType, nom : string, dateArray : Date[],heureArray : number[],lieu : string,info_en_plus : string)
{
    const dateActu = new Date();
    const title = typeEnv === EVentType.Event ? `Prochain Evènement - ${nom}` : `Prochaine reunion - ${nom}`;
    let date = typeEnv === EVentType.Event ? `de ${displayDate(dateArray[0])} à ${displayDate(dateArray[1])}` : `date : ${displayDate(dateArray[0])}`;
    if(typeEnv === EVentType.Event &&dateActu.toDateString() === dateArray[0].toDateString() && dateActu.toDateString() === dateArray[1].toDateString())
    {
        date = "date : Aujourd'hui";
    }
    const [integerPart,DecimalPart] = splitNumber(heureArray[0]);
    const [integerPartFin,DecimalPartFin] = splitNumber(heureArray[1]);
    let strDecimalPart = decimalPartToStr(DecimalPart);
    let strDecmialPartFin = decimalPartToStr(DecimalPartFin);
    const infoEnPlusText = info_en_plus === "" ? "Aucun description n'a été fourni" : "Description : " + info_en_plus;
    const description = `${date}\nheure : ${integerPart}h${strDecimalPart} -> ${integerPartFin}h${strDecmialPartFin}\nlieu : ${lieu}\n${infoEnPlusText}`
    return new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle(title)
                    .setDescription(description)
                    .setFooter({
                        text: "Au plaisir de vous aidez",
                        iconURL: bot.user?.displayAvatarURL() || ""
    })
}