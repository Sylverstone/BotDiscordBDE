import { EmbedBuilder, Events } from "discord.js";
import * as path from "path";
import __dirname from "../dirname.js";
import lookIfCommandsValid from "../Fonctions/lookIfCommandsValid.js";
import { pathToFileURL } from "url";
import { capFirstLetter } from "./CommandInteraction.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
const name = Events.MessageCreate;
const exec = async (bot, message) => {
    //ce script est executé pour tout messages en DM, mais également pour tout message en guild qui n'est pas une commande    
    if (!bot.user)
        return;
    const isCommand = message.content.startsWith("!");
    const specialCommand = ["+event", "+reunion"];
    const botSendThat = message.author.id === bot.user.id;
    if (!isCommand) {
        if (message.content.startsWith("/")) {
            let pathToCommand;
            if (!message.guild) {
                pathToCommand = pathToFileURL(path.join(__dirname, "Avertissements", "helpDmMessage.js")).href;
            }
            else {
                pathToCommand = pathToFileURL(path.join(__dirname, "Avertissements", "helpGuildMessage.js")).href;
            }
            const command = await import(pathToCommand);
            command.run(message);
            return;
        }
        return;
    }
    const messageWithoutPrefix = message.content.slice(1);
    const messageArray = messageWithoutPrefix.split(" ");
    const commandName = messageArray[0];
    if (!lookIfCommandsValid(commandName)) {
        if (!message.guild)
            return message.reply(`La commande ${commandName} n'existe pas :(`);
        return displayEmbedsMessage(message, new EmbedBuilder()
            .setTitle("Information")
            .setDescription("La commande ${commandName} n'existe pas"));
    }
    const additionnalFile = ["event", 'reunion'];
    const args = messageArray.slice(1);
    const pathToCommand = additionnalFile.includes(commandName) ? pathToFileURL(path.join(__dirname, "Commands", capFirstLetter(commandName), commandName)).href
        : pathToFileURL(path.join(__dirname, "Commands", commandName)).href;
    const command = await import(pathToCommand);
    if (!command.onlyGuild) {
        command.run(bot, message, args);
    }
    else {
        return message.reply(`La commande ${commandName} n'est utilisable que dans un serveur :)`);
    }
};
export { name, exec };
