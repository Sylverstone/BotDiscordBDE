import { DiscordAPIError, EmbedBuilder } from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";
import make_log from "./makeLog.js";
export default function handleError(message, error, edit = false) {
    make_log(false, message);
    console.log("[error] " + error);
    if (error instanceof DiscordAPIError) {
        displayEmbedsMessage(message, new EmbedBuilder()
            .setTitle("Erur")
            .setDescription("Une erreur du côté de l'API de discord a eu lieu"), edit);
        return;
    }
    else {
        displayEmbedsMessage(message, new EmbedBuilder()
            .setTitle("Erreur")
            .setDescription("Une erreur a eu lieu"), edit);
        return;
    }
}
