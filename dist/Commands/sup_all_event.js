import { EmbedBuilder } from "discord.js";
import "dotenv/config";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "sup_all_event";
export const onlyGuild = true;
export const howToUse = "Vous n'avez qu'a tapez `/recapdirect` et la commande renverra le dernier récap dans le chat directement";
export const run = async (bot, message) => {
    if (!message.guild)
        return;
    message.guild.scheduledEvents.fetch().then((EventList) => {
        EventList.forEach(async (event) => {
            await event.delete();
        });
    });
    message.guild.scheduledEvents.cache.forEach(e => e.delete());
    displayEmbedsMessage(message, new EmbedBuilder()
        .setTitle("Information")
        .setDescription("Touts les évènements ont été supprimé"));
};
