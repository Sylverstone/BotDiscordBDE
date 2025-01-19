import { Client, CommandInteraction, Message, MessageFlags } from "discord.js";
import "dotenv/config";
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
                        text: "Au plaisr de vous aidez",
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
    const author_name = message instanceof Message ? message.author : message.user;
    console.log("command succes -author:", author_name);
};
export const run = async (bot, message) => {
    if (bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message)) {
        const author_name = message instanceof Message ? message.author : message.user;
        try {
            console.log(author_name, "is running help");
            displayMessageHelp(message, bot);
        }
        catch (error) {
            console.log("command went wrong while", author_name, "was running it\n", error);
            return message.reply("Une erreur a eu lieu lors de l'exécution de la commande");
        }
    }
};
