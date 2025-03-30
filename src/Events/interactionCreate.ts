import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    CommandInteraction,
    Events,
    ModalSubmitInteraction
} from "discord.js"
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";
import saveEvent from "../Commands/Event/_saveEvent.js";
import saveReunion from "../Commands/Reunion/_saveReunion.js";
import {customId} from "../Enum/customId.js";

const name = Events.InteractionCreate;
export const capFirstLetter = (str : string) => 
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const exec = async (bot : CBot, interaction : CommandInteraction | ButtonInteraction | ModalSubmitInteraction) =>  {


    if(interaction.isChatInputCommand())
    {
        const commandName = interaction.commandName;
        const additionalFile = ["event","reunion"];
        const filePath = additionalFile.includes(commandName) ? pathToFileURL(path.join(__dirname,"Commands",capFirstLetter(commandName),commandName + ".js"))
            : pathToFileURL(path.join(__dirname,"Commands",commandName + ".js"));
        const {run} = await import(filePath.href);
        run(bot,interaction)
    }
    else if(interaction.isButton())
    {
        if(interaction.customId === customId.event.toString())
        {
            await saveEvent(interaction,bot,2)
        }
        else if(interaction.customId === customId.reunion.toString())
        {
            await saveReunion(interaction,bot,2)
        }
    }
    else if(interaction.isModalSubmit())
    {

    }
}

export{name,exec}
