import { SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";
import 'dotenv/config';
import handleError from "../Fonctions/handleError.js";
import { deleteFromTableWithId } from "../Fonctions/DbFunctions.js";
import { createDate } from "../Fonctions/DateScript.js";
import make_log from "../Fonctions/makeLog.js";
export const description = "Cette commande vous permet de supprimer une réunion";
export const name = "sup_reunion";
export const howToUse = "`/supReunion` vous permet de supprimer une réunion. Vous devez saisir son nom, sa date, son id (écrit dans la description) ainsi que son heure de debut";
export const option = [
    new SlashCommandStringOption()
        .setName("nom_reunion")
        .setDescription("le nom de la reunion")
        .setRequired(true),
    new SlashCommandStringOption()
        .setName("date_reunion")
        .setDescription("la date de la reunion")
        .setRequired(true),
];
export const optionInt = [
    new SlashCommandIntegerOption()
        .setName("id_reunion")
        .setDescription("l'id de la reunion")
        .setRequired(true),
    new SlashCommandIntegerOption()
        .setName("heure_debut")
        .setDescription("l'heure de début de la réunion")
        .setRequired(true),
];
export const onlyGuild = true;
export const run = async (bot, message) => {
    try {
        const nomEv = message.options.get("nom_reunion");
        const resIdEv = message.options.get("id_reunion");
        const res_heureDebut = message.options.get("heure_debut");
        const res_dateReunion = message.options.get("date_reunion");
        const nom = nomEv?.value;
        const id = resIdEv?.value;
        const heureDebut = res_heureDebut?.value;
        const dateReunion = res_dateReunion?.value;
        if (!(typeof nom === "string" && typeof id === "number" && typeof heureDebut === "number" && typeof dateReunion === "string"))
            return message.reply(typeof nom);
        const guild = message.guild;
        const temp_date = createDate(dateReunion);
        if (!(temp_date instanceof Date))
            return;
        const date = temp_date;
        date.setHours(heureDebut);
        if (!guild) {
            make_log(true, message);
            return message.reply("not a guild");
        }
        else {
            const events = await guild.scheduledEvents.fetch();
            const event = events.find(e => {
                if (e.scheduledStartTimestamp) {
                    const temp_date = new Date(e.scheduledStartTimestamp);
                    return e.name.toLowerCase() === nom.toLowerCase() && temp_date.getTime() === date.getTime();
                }
            });
            if (event) {
                console.log(event);
                await event.delete();
                await deleteFromTableWithId("Reunion", "idReunion", id, bot, message);
                return message.reply("L'évènement a été supprimé");
            }
            make_log(true, message);
            return message.reply("Il n'existe pas d'évènements de ce nom");
        }
    }
    catch (Err) {
        if (Err instanceof Error) {
            handleError(message, Err);
        }
    }
};
