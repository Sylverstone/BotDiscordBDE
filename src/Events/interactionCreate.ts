import { CommandInteraction, Events } from "discord.js"
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";

const name = Events.InteractionCreate;

const exec = async (bot : CBot, interaction : CommandInteraction) =>  {
   
    if(!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const filePath = commandName === "event" ? pathToFileURL(path.join(__dirname,"Commands","Event",commandName + ".js"))
                                            : pathToFileURL(path.join(__dirname,"Commands",commandName + ".js"));
    const {run} = await import(filePath.href);
    run(bot,interaction)
}

export{name,exec}
