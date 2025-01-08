import { Events, Message } from "discord.js"
import path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import lookIfCommandsValid from "../Fonctions/lookIfCommandsValid.js";

const name = Events.MessageCreate;

const exec = async (bot, message) =>  {
    const commandsFolder = path.join(__dirname, "Commands");
    if(message instanceof Message && message.guild === null)
    {
        const isCommand = message.content.startsWith("!");
        if(!isCommand)
        {
            if(message.content.startsWith("/"))
            {
                const pathToCommand = pathToFileURL(path.join(__dirname,"Avertissements","helpDmMessage.js"));
                const command = await import(pathToCommand);
                command.run(bot,message);
                return;
            }
            return;
           
        }
        const messageWithoutPrefix = message.content.slice(1);
        const messageArray = messageWithoutPrefix.split(" ");
        const commandName = messageArray[0];
        if(!lookIfCommandsValid(commandName)){
            return message.reply(`La commande ${commandName} n'existe pas :(`);
        } 
        const args = messageArray.slice(1);
        const pathToCommand = pathToFileURL(path.join(commandsFolder,commandName + ".js"));
        const command = await import(pathToCommand);
        command.run(bot,message,args)
    }
}

export{name,exec}
