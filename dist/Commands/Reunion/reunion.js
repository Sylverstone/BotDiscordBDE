import { MessageFlags, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import transfromOptionToObject from '../../Fonctions/transfromOptionToObject.js';
import handleError from '../../Fonctions/handleError.js';
import EmptyObject from '../../Fonctions/LookIfObjectIsEmpty.js';
import displayReunion from './_displayReunion.js';
import saveReunion from './_saveReunion.js';
import make_log from '../../Fonctions/makeLog.js';
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
        let optionObject = transfromOptionToObject(message);
        if (EmptyObject(optionObject))
            displayReunion(message, bot);
        else
            saveReunion(message, bot, optionObject);
        return make_log(true, message);
    }
    catch (error) {
        if (error instanceof Error) {
            handleError(message, error, true);
        }
    }
};
export { description, name, run, option, optionNum, onlyGuild };
