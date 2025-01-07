import { Events } from "discord.js"
import path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import fs from "fs";

const name = Events.InteractionCreate;


const exec = async (bot, interaction) =>  {
    if(!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const {run} = await import(pathToFileURL(path.join(__dirname,"Commands",commandName + ".js")))
    run(bot,interaction)
}

export{name,exec}
