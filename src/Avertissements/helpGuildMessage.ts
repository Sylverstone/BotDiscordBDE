import { Message } from "discord.js";
import "dotenv/config"

export const  run = async(message : Message) => {
    return message.reply("Cette commande n'existe pas :)"); 
}