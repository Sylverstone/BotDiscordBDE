import { Events, Message } from "discord.js"
import path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import fs from "fs";


const name = Events.MessageCreate;
const lookIfCommandsValid = (commandName) =>
    {
        const ListeCommands = fs.readdirSync(path.join(__dirname,"Commands")).filter(async commandName => {
            const command = await import(pathToFileURL(path.join(__dirname,"Commands",commandName)));
            return command.notAcommand === undefined;
        }).map(commandName => commandName.slice(0, commandName.length - 3));
    
        return ListeCommands.includes(commandName);
        
    
    }

const exec = async (bot, message) =>  {
    console.log("having a message")
    const commandsFolder = path.join(__dirname, "Commands");
    if(message instanceof Message && message.guild === null)
    {
        const isCommand = message.content.startsWith("!");
        if(!isCommand)
        {
            if(message.content.startsWith("/"))
            {
                const pathToCommand = pathToFileURL(path.join(commandsFolder,"helpDmMessage.js"));
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
    else
    {
        console.log("message was from a guild")
    }
}

export{name,exec}
