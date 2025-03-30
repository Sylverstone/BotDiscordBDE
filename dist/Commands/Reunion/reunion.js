import { SlashCommandBooleanOption } from 'discord.js';
import transfromOptionToObject from '../../Fonctions/transfromOptionToObject.js';
import handleError from '../../Fonctions/handleError.js';
import displayReunion from './_displayReunion.js';
import saveReunion from './_saveReunion.js';
import make_log from '../../Fonctions/makeLog.js';
const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";
const name = "reunion";
const onlyGuild = true;
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion 'date' 'sujet' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'`. Une deuxième réunion sera alors sauvegarder";
export const optionBoolean = [
    new SlashCommandBooleanOption()
        .setName("creer_reunion")
        .setDescription("True si vous voulez creer une réunion, False sinon.")
        .setRequired(true)
];
const isOptionData_t = (elt) => {
    return elt !== null && typeof elt === "object" && "creer_reunion" in elt;
};
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
    try {
        let optionObject = transfromOptionToObject(message);
        if (!isOptionData_t(optionObject))
            return;
        const { creer_reunion } = optionObject;
        if (!creer_reunion)
            await displayReunion(message, bot);
        else
            await saveReunion(message, bot);
        return make_log(true, message);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            handleError(message, error, true);
        }
    }
};
export { description, name, run, onlyGuild };
