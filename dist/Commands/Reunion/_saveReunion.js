import { EmbedBuilder } from "discord.js";
import CreateEvent from "../../Fonctions/CreateEvent.js";
import { createDate } from "../../Fonctions/DateScript.js";
import { SaveValueToDB, getLastId } from "../../Fonctions/DbFunctions.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import handleError from "../../Fonctions/handleError.js";
import make_log from "../../Fonctions/makeLog.js";
import splitNumber from "../../Fonctions/splitHeure.js";
import { isReunion, isMaxId } from "./reunion.js";
export default async function saveReunion(message, bot, optionObject) {
    if (!message.guild)
        return;
    if (!("info_en_plus" in optionObject)) {
        optionObject["info_en_plus"] = "Pas d'informations en plus";
    }
    if (!isReunion(optionObject))
        return message.editReply("La définition de la réunion n'est pas complète :(");
    8;
    const optionReunion = optionObject;
    const dateActu = new Date();
    if (optionReunion.date instanceof Date)
        return;
    //date est un string
    const dateDebut = createDate(optionReunion.date);
    const [stringIntegerPart, stringDecimalPart] = splitNumber(optionReunion.heuredebut);
    const [stringIntegerPartFin, stringDecimalPartFin] = splitNumber(optionReunion.heurefin);
    const dateFin = createDate(optionReunion.date);
    if (!(dateFin instanceof Date && dateDebut instanceof Date))
        throw Error("Erreur de développement, DateFIn et dateDebut ne sont pas de type Date");
    dateDebut.setHours(+stringIntegerPart, stringDecimalPart);
    dateFin.setHours(+stringIntegerPartFin, stringDecimalPartFin);
    if (dateActu.getTime() > dateDebut.getTime())
        return message.editReply("La reunion ne peut pas être défini dans le passé");
    //le changement de séparateur est obligatoire
    optionReunion.date = optionReunion.date.replace("/", "-").replace("/", "-");
    let name = `Reunion ${dateDebut.getDate()}/${dateDebut.getMonth() + 1}`;
    let EventList = await message.guild.scheduledEvents.fetch();
    EventList = EventList.filter(event => event.name.startsWith(name));
    if (EventList.size > 0) {
        name = `Reunion ${dateDebut.getDate()}/${dateDebut.getMonth() + 1} (${EventList.size})`;
    }
    const finalObjectEvent = {
        date: dateDebut.toISOString().replace("T", " ").replace("Z", " "),
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
            return;
        const id = res.maxId;
        CreateEvent(message, sujet, dateDebut, dateFin, lieu, info_en_plus, id, finalObjectEvent.reunion_name)
            .then((name) => {
            displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Reunion")
                .setDescription("La reunion a été crée. Elle se nomme : " + name), true);
            make_log(true, message);
        })
            .catch(err => {
            displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Information")
                .setDescription("Une erreur a eu lieu :("), true);
            make_log(false, message);
        });
    })
        .catch(err => {
        handleError(message, err, true);
    });
}
