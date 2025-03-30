import { Events, } from "discord.js";
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
const name = Events.InteractionCreate;
export const capFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const exec = async (bot, interaction) => {
    if (interaction.isChatInputCommand()) {
        const commandName = interaction.commandName;
        const additionalFile = ["event", "reunion"];
        const filePath = additionalFile.includes(commandName) ? pathToFileURL(path.join(__dirname, "Commands", capFirstLetter(commandName), commandName + ".js"))
            : pathToFileURL(path.join(__dirname, "Commands", commandName + ".js"));
        const command = await import(filePath.href);
        const { run } = command;
        run(bot, interaction, []);
    }
};
export { name, exec };
