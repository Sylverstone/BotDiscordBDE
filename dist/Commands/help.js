import { Client, CommandInteraction, Message, MessageFlags } from "discord.js";
import "dotenv/config";
import make_log from "../Fonctions/makeLog.js";
import handleError from "../Fonctions/handleError.js";
export const description = "Cette commande vous indiquera les commandes du bot ainsi que leur description";
export const name = "help";
export const howToUse = "Vous n'avez qu'a écrire `/help` et des indications sur toutes les commandes seront retournés";
export const onlyGuild = false;
const displayMessageHelp = async (message, bot) => {
    if (message instanceof CommandInteraction) {
        await message.reply({
            embeds: [{
                    title: "Liste des commandes",
                    description: bot.commands.map(command => `**__Nom de commande__** : \`${command.name}\`.\n> ${command.description}`).join("\n\n") || "Aucune commande disponible",
                    color: 0xff0000,
                    footer: {
                        text: "Au plaisir de vous aidez",
                        icon_url: bot.user?.displayAvatarURL() || ""
                    }
                }],
            flags: [MessageFlags.Ephemeral],
        });
    }
    else {
        await message.reply({
            embeds: [{
                    title: "Liste des commandes",
                    description: bot.commands.map(command => `**__Nom de commande__** : \`${command.name}\`.\n> ${command.description}`).join("\n\n") || "Aucune commande disponible",
                    color: 0xff0000,
                    footer: {
                        text: "Au plaisr de vous aidez",
                        icon_url: bot.user?.displayAvatarURL() || ""
                    }
                }],
        });
    }
    if (message instanceof CommandInteraction)
        make_log(true, message);
};
export const run = async (bot, message) => {
    if (bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message)) {
        try {
            displayMessageHelp(message, bot);
        }
        catch (error) {
            if (message instanceof CommandInteraction && error instanceof Error)
                handleError(message, error);
        }
    }
};
