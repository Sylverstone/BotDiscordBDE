import { EmbedBuilder, hyperlink, SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";
import { createDate } from "../Fonctions/DateScript.js";
import { SaveValueToDB, getValueFromDB } from "../Fonctions/DbFunctions.js";
import 'dotenv/config';
import transfromOptionToObject from "../Fonctions/transfromOptionToObject.js";
import CreateEvent from "../Fonctions/CreateEvent.js";
import handleError from "../Fonctions/handleError.js";
export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "event";
export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/event` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event name date more` Ici les Concerne des nou";
export const option = [
    new SlashCommandStringOption()
        .setName("name")
        .setDescription("le nom de l'évènements")
        .setRequired(false),
    new SlashCommandStringOption()
        .setName("datedebut")
        .setDescription("la date de début de l'évènements")
        .setRequired(false),
    new SlashCommandStringOption()
        .setName("datefin")
        .setDescription("la date de fin l'évènements")
        .setRequired(false),
    new SlashCommandStringOption()
        .setName("lieu")
        .setDescription("le lieu de l'évènements")
        .setRequired(false),
    new SlashCommandStringOption()
        .setName("more")
        .setDescription("Lien pour en savoir plus")
        .setRequired(false),
];
export const optionInt = [
    new SlashCommandIntegerOption()
        .setName("heuredebut")
        .setDescription("heure de début l'évènements")
        .setRequired(false),
    new SlashCommandIntegerOption()
        .setName("heurefin")
        .setDescription("heure de fin l'évènements")
        .setRequired(false)
];
function isEvent(object) {
    return (typeof object === 'object' &&
        object !== null &&
        'lieu' in object &&
        'more' in object &&
        'datedebut' in object &&
        'datefin' in object &&
        'name' in object &&
        'heuredebut' in object &&
        'heurefin' in object
    /*
    typeof (object as Evenement_t).lieu === 'string' &&
    typeof (object as Evenement_t).more === 'string' &&
    typeof (object as Evenement_t).datedebut === 'string' &&
    typeof (object as Evenement_t).datefin === 'string' &&
    typeof (object as Evenement_t).name === 'string' &&
    typeof (object as Evenement_t).heuredebut === 'number' &&
    typeof (object as Evenement_t).heurefin === 'number'*/
    );
}
function isEventArray(value) {
    return Array.isArray(value) && value.every(item => isEvent(item));
}
const getDataEvent = (Ev) => {
    const textInfoPlus = Ev.more === "Aucune info en plus n'a été fournit" ? Ev.more + "." : `${hyperlink("Ici", Ev.more)} vous pourrez retrouvez plus d'information :)`;
    return `Le prochaine évènements est : \`${Ev.name}\` et il aura lieu le \`${Ev.datedebut}\` jusqu'au \`${Ev.datefin}\` à \`'${Ev.lieu}'\` de \`${Ev.heuredebut}h à ${Ev.heurefin}h\`.\n\n${textInfoPlus}`;
};
export const run = async (bot, message) => {
    try {
        console.log(message.user, "is running event");
        let { ObjectIsReal, optionObject } = transfromOptionToObject(message);
        if (!ObjectIsReal) {
            const objectEvent = await getValueFromDB(message, "lieu, more, datedebut,datefin, name, heuredebut, heurefin", "Event", "id", bot);
            console.log(objectEvent);
            if (objectEvent === null)
                return message.reply("Il n'y a pas d'Event planifié pour les prochains jours");
            if (!isEventArray(objectEvent))
                return;
            const DateAujourdhui = new Date();
            const allFuturEvent = objectEvent.filter((row) => {
                const date = createDate(row.datedebut);
                return date > DateAujourdhui;
            });
            let eventSet = true;
            let NearestEvent;
            if (allFuturEvent.length > 0) {
                NearestEvent = allFuturEvent[0];
                allFuturEvent.forEach((row) => {
                    const date = createDate(row.datedebut);
                    if (!(isEvent(NearestEvent)))
                        return;
                    if (date < createDate(NearestEvent.datedebut))
                        NearestEvent = row;
                });
            }
            else {
                NearestEvent = null;
                eventSet = false;
            }
            if (isEvent(NearestEvent)) {
                const textEnv = getDataEvent(NearestEvent);
                const embedText = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(NearestEvent.name)
                    .setFooter({
                    text: "Au plaisr de vous aidez",
                    iconURL: bot.user?.displayAvatarURL() || ""
                })
                    .setDescription(textEnv);
                console.log("command succes -author:", message.user);
                return message.reply({ embeds: [embedText] });
            }
            return message.reply("Il n'y a pas d'Event planifié pour les prochains jours");
        }
        else {
            if (!("more" in optionObject)) {
                optionObject["more"] = "Aucune info en plus n'a été fournit";
            }
            if (!isEvent(optionObject))
                return message.reply("La définition de l'Evenement n'est pas complète");
            const optionEvent = optionObject;
            const dateActu = new Date();
            const dateDebutEvent = createDate(optionEvent.datedebut);
            if (dateActu > dateDebutEvent)
                return message.reply("L'evenement ne peut pas être défini dans le passé");
            const finalObjectEvent = {
                name: optionEvent.name,
                datedebut: optionEvent.datedebut,
                datefin: optionEvent.datefin,
                heuredebut: optionEvent.heuredebut,
                heurefin: optionEvent.heurefin,
                lieu: optionEvent.lieu,
                more: optionEvent.more,
            };
            SaveValueToDB(message, bot, "Event", finalObjectEvent)
                .then(async (result) => {
                dateDebutEvent.setHours(optionEvent.heuredebut);
                const dateFinEvent = createDate(optionEvent.datefin);
                dateFinEvent.setHours(optionEvent.heurefin);
                const name = optionEvent.name;
                const lieu = optionEvent.lieu;
                const more = optionEvent.more;
                CreateEvent(message, name, dateDebutEvent, dateFinEvent, lieu, more, "Evènement");
                console.log("command succes -author:", message.user);
                return message.reply({ content: `Le changement a bien été fait ! :)` });
            })
                .catch(err => {
                handleError(message, err);
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            handleError(message, error);
        }
    }
};
