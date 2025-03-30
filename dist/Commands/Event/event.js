import { SlashCommandBooleanOption } from "discord.js";
import 'dotenv/config';
import transfromOptionToObject from "../../Fonctions/transfromOptionToObject.js";
import handleError from "../../Fonctions/handleError.js";
import displayEvent from "./_displayEvent.js";
import saveEvent from "./_saveEvent.js";
import make_log from "../../Fonctions/makeLog.js";
export const description = "Cette commande vous renvoie les infos du prochain Event de votre serveur";
export const name = "event";
export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/event` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event 'name' 'datedebut' 'datefin' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'` pour définir un Evènement";
const isOptionData_t = (option) => {
    return option !== null && typeof option === "object" && "creer_evenement" in option;
};
export const optionBoolean = [
    new SlashCommandBooleanOption()
        .setName("creer_evenement")
        .setDescription("True si vous voulez creer un évènement, False sinon.")
        .setRequired(true)
];
export const onlyGuild = true;
export function isEvent(object) {
    return (typeof object === 'object' &&
        object !== null &&
        'lieu' in object &&
        'info_en_plus' in object &&
        'datedebut' in object &&
        'datefin' in object &&
        'name' in object &&
        'heuredebut' in object &&
        'heurefin' in object);
}
export function isEventArray(value) {
    return Array.isArray(value) && value.every(item => isEvent(item));
}
export const run = async (bot, message) => {
    try {
        //await message.deferReply({flags : MessageFlags.Ephemeral});
        let optionObject = transfromOptionToObject(message);
        console.log(optionObject);
        if (!isOptionData_t(optionObject))
            return;
        const { creer_evenement } = optionObject;
        if (!creer_evenement)
            await displayEvent(message, bot);
        else {
            await saveEvent(message, bot);
        }
        //await saveEvent(optionObject,message,bot);
        return make_log(true, message);
    }
    catch (error) {
        if (error instanceof Error) {
            handleError(message, error, true);
        }
    }
};
