import { Events } from "discord.js";
import * as path from "path";
import __dirname from "../dirname.js";
import lookIfCommandsValid from "../Fonctions/lookIfCommandsValid.js";
import { pathToFileURL } from "url";
const name = Events.MessageCreate;
const exec = async (bot, message) => {
    const commandsFolder = path.join(__dirname, "Commands");
    const isCommand = message.content.startsWith("!");
    if (!isCommand) {
        if (message.content.startsWith("/")) {
            const pathToCommand = pathToFileURL(path.join(__dirname, "Avertissements", "helpDmMessage.js")).href;
            const command = await import(pathToCommand);
            command.run(bot, message);
            return;
        }
        return;
    }
    const messageWithoutPrefix = message.content.slice(1);
    const messageArray = messageWithoutPrefix.split(" ");
    const commandName = messageArray[0];
    if (!lookIfCommandsValid(commandName)) {
        return message.reply(`La commande ${commandName} n'existe pas :(`);
    }
    const args = messageArray.slice(1);
    const pathToCommand = pathToFileURL(path.join(commandsFolder, commandName + ".js")).href;
    const command = await import(pathToCommand);
    command.run(bot, message, args);
};
export { name, exec };
