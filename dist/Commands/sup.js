import { SlashCommandStringOption } from "discord.js";
import 'dotenv/config';
import handleError from "../Fonctions/handleError.js";
export const description = "Cette commande vous permet de supprimer une réunion";
export const name = "sup";
export const howToUse = "`/sup` vous permet de supprimer une réunion";
export const option = [
    new SlashCommandStringOption()
        .setName("ev_name")
        .setDescription("le nom de la reunion")
        .setRequired(true),
];
export const onlyGuild = true;
export const run = async (bot, message) => {
    try {
        const nomEv = message.options.get("ev_name");
        const nom = nomEv?.value;
        if (!(typeof nom === "string"))
            return message.reply(typeof nom);
        const guild = message.guild;
        if (!guild) {
            return message.reply("not a guild");
        }
        else {
            const events = await guild.scheduledEvents.fetch();
            const event = events.find(e => e.name.toLowerCase() === nom.toLowerCase());
            if (event) {
                console.log(event);
                await event.delete();
                return message.reply("L'évènement a été supprimé");
            }
            return message.reply("Il n'existe pas d'évènements de ce nom");
        }
    }
    catch (Err) {
        if (Err instanceof Error) {
            handleError(message, Err);
        }
    }
};
