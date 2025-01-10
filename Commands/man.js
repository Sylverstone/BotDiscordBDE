import { Client, CommandInteraction, Message, MessageFlags,SlashCommandStringOption } from "discord.js";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv"
import path from "path";
import fs from "fs";
import __dirname from "../dirname.js";
import lookIfCommandsValid from "../Fonctions/lookIfCommandsValid.js";
dotenv.config();

export const description = "Cette commande vous permettra d'en apprendre plus sur l'utilisation d'une commande";
export const name = "man";

export const howToUse = "J'imagine que vous savez dékà utilsier /man :)"

let choices = await getChoices()
export const option = new SlashCommandStringOption()
        .setName("commande")
        .setDescription("La commande que tu apprendres a utiliser")
        .setRequired(true)
        .addChoices(...choices);

    
async function getChoices(){
    let choices = [];
    const allCommandsScript = fs.readdirSync(path.join(__dirname, "Commands")).filter(file => file !== "man.js");

    for(const script of allCommandsScript)
    {

        const {name} = await import(pathToFileURL(path.join(__dirname, "Commands",script)));
        choices.push({name: name, value:name});
    }
    return choices;
}

const handleRun = async(version,message,args = [],bot) => {
    if(!(message instanceof CommandInteraction || message instanceof Message)) return;
    if(!(args instanceof Array)) return;
    let command;
    let commandName;
    if(version === 0)
    {
        const option = message.options.get("commande");
        commandName = option.value;
    }
    else
    {
        if(args.length === 0) return message.reply("La commande !man doit OBLIGATOIREMENT avoir un paramètre");
        commandName = args[0];
    }

    if(!lookIfCommandsValid(commandName)) return;

    try {
        command = await import(pathToFileURL(path.join(__dirname,"Commands",commandName + ".js")))
        console.log("command success while",message.user,"was running");
        return message.reply({ embeds: [{
            title : `Comment utiliser ${commandName}`,
            description : command.howToUse,
            footer: {
                text: "Au plaisr de vous aidez",
                iconURL: bot.user?.displayAvatarURL() || ""
            }
        }], flags: [MessageFlags.Ephemeral]})
    } catch (error) {
        console.log("command went wrong while",message.user,"was running it\n",error)
        return message.reply("Il y a eu une erreur pdt l'executiond de la commande");
    }


}

export const  run = async(bot, message, args) => {
    if (bot instanceof Client && (message instanceof Message || message instanceof CommandInteraction)) {
        console.log(message.user,"is running man");
        if(message instanceof CommandInteraction){
            console.log("there")
            handleRun(0,message,args,bot)
            return;
        }
        handleRun(1,message,args,bot)
    }
}