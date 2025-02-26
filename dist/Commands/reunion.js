import { EmbedBuilder, MessageFlags, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { getLastId, getValueFromDB, SaveValueToDB } from '../Fonctions/DbFunctions.js';
import transfromOptionToObject from '../Fonctions/transfromOptionToObject.js';
import CreateEvent from '../Fonctions/CreateEvent.js';
import handleError from '../Fonctions/handleError.js';
import splitNumber from '../Fonctions/splitHeure.js';
import make_log from '../Fonctions/makeLog.js';
import displayEmbedsMessage from '../Fonctions/displayEmbedsMessage.js';
import EmptyObject from '../Fonctions/LookIfObjectIsEmpty.js';
import filterFuturEvent from '../Fonctions/filterFuturEvent.js';
import makeEmbedABoutEvent from '../Fonctions/makeEmbedAboutEvent.js';
import { EVentType } from '../Enum/EventType.js';
const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";
const name = "reunion";
const onlyGuild = true;
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion 'date' 'sujet' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'`. Une deuxième réunion sera alors sauvegarder";
const option = [
    new SlashCommandStringOption()
        .setName("date")
        .setRequired(false)
        .setDescription("Paramètre permettant de définir une nouvelles dates :)"),
    new SlashCommandStringOption()
        .setName("sujet")
        .setRequired(false)
        .setDescription("indiquez le lieu de sujet de la reunion"),
    new SlashCommandStringOption()
        .setName("lieu")
        .setRequired(false)
        .setDescription("Indiquez le lieu de la réunion"),
    new SlashCommandStringOption()
        .setName("info_en_plus")
        .setRequired(false)
        .setDescription("Indiquez des infos supplémentaire si vous le souhaite")
];
const optionNum = [
    new SlashCommandNumberOption()
        .setName("heuredebut")
        .setRequired(false)
        .setDescription("Indiquez l'heure de début de la réunion"),
    new SlashCommandNumberOption()
        .setName("heurefin")
        .setRequired(false)
        .setDescription("Indiquez l'heure de fin de la réunion")
];
export function isMaxId(result) {
    return (result !== null && typeof result === "object"
        && "maxId" in result && typeof result.maxId === "number");
}
export function isReunion(result) {
    return (result !== null && typeof result === "object"
        && "date" in result && "sujet" in result
        && "lieu" in result && "info_en_plus" in result
        && "heuredebut" in result && "heurefin" in result);
}
export function isReunionArray(result) {
    return Array.isArray(result) && result.every(row => isReunion(row));
}
const run = async (bot, message) => {
    await message.deferReply({ flags: MessageFlags.Ephemeral });
    try {
        handleRun(message, bot);
    }
    catch (error) {
        if (error instanceof Error) {
            //handleError(message,error)
        }
    }
};
export { description, name, run, option, optionNum, onlyGuild };
async function handleRun(message, bot) {
    new Date("2025-02-31");
    let optionObject = transfromOptionToObject(message);
    if (EmptyObject(optionObject)) {
        await getValueFromDB(message, "date, heuredebut, heurefin, lieu, info_en_plus, sujet,reunion_name", "Reunion", "idReunion", bot)
            .then(async (result) => {
            if (result === null)
                return message.editReply("Il n'y a pas de reunion l'instant.");
            if (isReunionArray(result)) {
                result.forEach(r => {
                    console.log(r.reunion_name);
                });
                const allfuturReunion = filterFuturEvent(result);
                if (!(isReunionArray(allfuturReunion)))
                    return;
                let NearestReunion;
                if (allfuturReunion.length > 0) {
                    NearestReunion = allfuturReunion[0];
                    allfuturReunion.forEach((row) => {
                        const date = row.date;
                        if (!(date instanceof Date))
                            return;
                        if (!(isReunion(NearestReunion)))
                            return;
                        const temp_date = NearestReunion.date;
                        if (!(temp_date instanceof Date))
                            return;
                        if (date < temp_date)
                            NearestReunion = row;
                    });
                }
                else {
                    NearestReunion = null;
                }
                if (isReunion(NearestReunion)) {
                    const { date, sujet, heuredebut, heurefin, lieu, info_en_plus } = NearestReunion;
                    if (!(date instanceof Date))
                        return;
                    const embedText = makeEmbedABoutEvent(bot, EVentType.Reunion, sujet, [date,], [heuredebut, heurefin], lieu, info_en_plus);
                    make_log(true, message);
                    return message.editReply({ embeds: [embedText] });
                }
                else {
                    make_log(true, message);
                    return message.editReply("Il n'y a pas de prochaine reunion prévu pour l'instant.\n");
                }
            }
            return message.editReply("Il n'y a pas de reunion l'instant.");
        });
    }
    else {
        //Insertion de donnée dans la base
        try {
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
            console.log("date debut  :", dateDebut, "\n", dateActu);
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
                console.log("date :", dateDebut, dateFin);
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
        catch (error) {
            console.log(error);
        }
    }
}
