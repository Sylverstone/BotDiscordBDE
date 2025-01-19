import { CommandInteraction, Events } from "discord.js"
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";

const name = Events.InteractionCreate;

const exec = async (bot : CBot, interaction : CommandInteraction) =>  {
    if(!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const {run} = await import(pathToFileURL(path.join(__dirname,"Commands",commandName + ".js")).href);
    run(bot,interaction)
}

export{name,exec}
