import { EmbedBuilder } from "discord.js";
import CreateEvent from "../../Fonctions/CreateEvent.js";
import { createDate } from "../../Fonctions/DateScript.js";
import { SaveValueToDB, getLastId } from "../../Fonctions/DbFunctions.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import splitNumber from "../../Fonctions/splitHeure.js";
import { isReunion, isMaxId } from "./reunion.js";
import date from "../../Class/Date/Date.js";
export default async function saveReunion(message, bot, optionObject) {
    if (!message.guild)
        throw new Error("Aucune guild n'est dispo");
    if (!("info_en_plus" in optionObject)) {
        optionObject["info_en_plus"] = "Pas d'informations en plus";
    }
    if (!isReunion(optionObject))
        return message.editReply("La définition de la réunion n'est pas complète :(");
    8;
    const optionReunion = optionObject;
    const dateActu = new date();
    if (!(typeof optionReunion.date === "string"))
        throw new Error("OptionReunion.date must be a string");
    //date est un string
    const dateDebut = createDate(optionReunion.date);
    const [stringIntegerPart, stringDecimalPart] = splitNumber(optionReunion.heuredebut);
    const [stringIntegerPartFin, stringDecimalPartFin] = splitNumber(optionReunion.heurefin);
    const dateFin = createDate(optionReunion.date);
    if (!(dateFin instanceof date && dateDebut instanceof date))
        throw Error("Erreur de développement, DateFIn et dateDebut ne sont pas de type Date");
    dateDebut.setHours(+stringIntegerPart, stringDecimalPart);
    dateFin.setHours(+stringIntegerPartFin, stringDecimalPartFin);
    if (dateActu.getTime() > dateDebut.getTime())
        return message.editReply("La reunion ne peut pas être défini dans le passé");
    //le changement de séparateur est obligatoire
    optionReunion.date = optionReunion.date.replace("/", "-").replace("/", "-");
    let name = `Reunion ${dateDebut.getDay()}/${dateDebut.getMonth()}`;
    let EventList = await message.guild.scheduledEvents.fetch();
    EventList = EventList.filter(event => event.name.startsWith(name));
    if (EventList.size > 0) {
        name = `Reunion ${dateDebut.getDay()}/${dateDebut.getMonth()} (${EventList.size})`;
    }
    const finalObjectEvent = {
        date: dateDebut.toString(),
        sujet: optionReunion.sujet,
        lieu: optionReunion.lieu,
        info_en_plus: optionReunion.info_en_plus,
        heuredebut: optionReunion.heuredebut,
        heurefin: optionReunion.heurefin,
        reunion_name: name
    };
    SaveValueToDB(message, bot, "Reunion", finalObjectEvent)
        .then(async (result) => {
        const sujet = optionReunion.sujet;
        const lieu = optionReunion.lieu;
        const info_en_plus = optionReunion.info_en_plus;
        const res = await getLastId("Reunion", "idReunion", bot);
        if (!isMaxId(res))
            throw new Error("res n'est pas la valeur attendu");
        const id = res.maxId;
        CreateEvent(message, sujet, dateDebut, dateFin, lieu, info_en_plus, id, finalObjectEvent.reunion_name)
            .then(async (name) => {
            await displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Reunion")
                .setDescription("La reunion a été crée. Elle se nomme : " + name), true);
        })
            .catch(async (err) => {
            await displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Information")
                .setDescription("Une erreur a eu lieu :("), true);
        });
    })
        .catch(err => {
        throw err;
    });
}
