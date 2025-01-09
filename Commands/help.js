import { Client, CommandInteraction, InteractionResponseType, Message, MessageFlags } from "discord.js";
import dotenv from "dotenv"
dotenv.config();

export const description = "Cette commande vous indiquera les commandes du bot";
export const name = "help";
export const howToUse = "Vous n'avez qu'a écrire `/help` et des indications sur toutes les commandes seront retournés"

const displayMessageHelp = async(message,bot) => 
{
    if(!(message instanceof Message || message instanceof CommandInteraction)) return;
    await message.reply({embeds : [{
        title: "Liste des commandes",
        
        description: bot.commands.map(command => 
            `**__Nom de commande__** : \`${command.name}\`.\n> ${command.description}`
        ).join("\n\n") || "Aucune commande disponible",
        color: 0xff0000,
        footer: {
            text: "Au plaisr de vous aidez",
            iconURL: bot.user?.displayAvatarURL() || ""
        }
    }], flags : [MessageFlags.Ephemeral]
    
    });
    console.log("command succes -author:",message.user);
}

export const  run = async(bot, message, args) => {
    if (bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message)) {
        try {
            console.log(message.user,"is running help");

            displayMessageHelp(message,bot)
        } catch (error) {
            console.log("command went wrong while",message.user,"was running it\n",error)
            return message.reply("Une erreur a eu lieu lors de l'exécution de la commande")
        }
       
    }
    
    
}