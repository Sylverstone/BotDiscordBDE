import { Events } from "discord.js"
import path from "path";


    const name = Events.InteractionCreate;

    const exec = async (bot, interaction) =>  {
        if(!interaction.isChatInputCommand()) return;
        const commandName = interaction.commandName;
        const {run} = await import(path.join("..","Commands",commandName + ".js"))
        run(bot,interaction)
    }
    
    export{name,exec}
