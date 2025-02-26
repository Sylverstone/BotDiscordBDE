import { EmbedBuilder } from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";
import splitNumber from "./splitHeure.js";
import date from "../Class/Date/Date.js";
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
export function createDate(ndate) {
    let jour = "";
    let mois = "";
    let annee = "";
    if (ndate.includes("/")) {
        [jour, mois, annee] = ndate.split("/");
    }
    else if (ndate.includes("-")) {
        [jour, mois, annee] = ndate.split("-");
    }
    else {
        return undefined;
    }
    return new date(`${jour}-${mois}-${annee}`);
}
export function dateToOnlyDate(date) {
    if (!(date instanceof Date))
        return;
    return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
export function setup_date(dateDebut, DateFin, heureDebut, heureFin, message) {
    const dateDebutEvent = createDate(dateDebut);
    const dateFinEvent = createDate(DateFin);
    const [stringHeureDebutInt, stringHeureDebutDecimal] = splitNumber(heureDebut);
    const [stringHeureFintInt, stringHeureFinDecimal] = splitNumber(heureFin);
    if (!(dateDebutEvent instanceof date && dateFinEvent instanceof date)) {
        displayEmbedsMessage(message, new EmbedBuilder()
            .setTitle("Erreur")
            .setDescription("Le format de date que vous avez transmis est incorrect :)"));
        return null;
    }
    dateDebutEvent.setHours(+stringHeureDebutInt, +stringHeureDebutDecimal);
    dateFinEvent.setHours(+stringHeureFintInt, +stringHeureFinDecimal);
    return [dateDebutEvent, dateFinEvent];
}
export function to_date_sql(date) {
    //le separateur doit être ABSOLUMENT "-" ici.
    const [jour, mois, annee] = date.split("-");
    console.log("la date qui doit être transfo", date);
    return `${annee}-${mois}-${jour}`;
}
export function IsDate(date) {
}
