import { Events, Message } from "discord.js"
import path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";


const name = Events.MessageCreate;

const exec = async (bot, message) =>  {
    console.log("having a message")
    if(message instanceof Message && message.guild === null)
    {
        const isCommand = message.content.startsWith("!");
        if(!isCommand) return;
        const messageWithoutPrefix = message.content.slice(1);
        const messageArray = messageWithoutPrefix.split(" ");
        const commandName = messageArray[0];
        const args = messageArray.slice(1);
        const pathToCommand = pathToFileURL(path.join(__dirname,"Commands",commandName + ".js"));
        console.log(pathToCommand);
        const command = await import(pathToCommand);
        command.run(bot,message,args)
    }
    else
    {
        console.log("message was from a guild")
    }
}

export{name,exec}
