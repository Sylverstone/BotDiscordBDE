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
        const split = ndate.split("/");
        if (split.length !== 3)
            return undefined;
        [jour, mois, annee] = split;
    }
    else if (ndate.includes("-")) {
        const split = ndate.split("-");
        if (split.length !== 3)
            return undefined;
        [jour, mois, annee] = split;
    }
    else {
        return undefined;
    }
    return new date(`${jour}-${mois}-${annee}`);
}
export function dateToOnlyDate(date) {
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
//Verifie que les dates soient cohérentes. Soit dateFin >= dateDebut et dateDebut => dateActu
export function verifLogicDate(dateDebut, dateFin) {
    const dateActu = new date();
    return dateFin.getTime() >= dateDebut.getTime() && dateDebut.getTime() >= dateActu.getTime();
}
//Verifies que les dates soient cohérentes. Soit dateFin >= dateDebut et dateDebut => dateActu
//La subtilité est que les heures ne sont pas pris en compte. Sert quand l'heure de la date de début et de fin ne sont pas encore définit
export function verifLogicDateWithoutHour(dateDebut, dateFin) {
    const dateActu = new date();
    dateActu.setHours(0, 0, 0);
    console.log(dateActu);
    console.log(dateActu);
    console.log(dateFin);
    return dateFin.getTime() >= dateDebut.getTime() && dateDebut.getTime() >= dateActu.getTime();
}
