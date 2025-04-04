import { SlashCommandStringOption } from 'discord.js';
import handleError from '../../Fonctions/handleError.js';
import displayReunion from './_displayReunion.js';
import saveReunion from './_saveReunion.js';
import make_log from '../../Fonctions/makeLog.js';
const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";
const name = "reunion";
const onlyGuild = true;
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion 'date' 'sujet' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'`. Une deuxième réunion sera alors sauvegarder";
export const option = [
    new SlashCommandStringOption()
        .setName("creer-reunion")
        .setDescription("Oui si vous voulez en creer une. Rien sinon")
        .setRequired(false)
        .addChoices({ name: "Oui", value: "Oui" })
];
export const isSqlReunion_t = (value) => {
    return value !== null && typeof value === "object" && "idReunion" in value && "GuildId" in value && "sujet" in value
        && "lieu" in value && "info_en_plus" in value && "date" in value && "heuredebut" in value && "heurefin" in value
        && "reunion_name" in value;
};
export const isSqlReunion_tArray = (value) => {
    return Array.isArray(value) && value.every(val => isSqlReunion_t(val));
};
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
        const length = message.options.data.length;
        if (length <= 0)
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
