import { Client } from "discord.js";
import dotenv from "dotenv"
dotenv.config();

export const description = "Commande donnant un lien OneDrive vers le dernier récaps de reunions";
export const name = "recap";

export const  run = async(bot, message, args) => {
    if (bot instanceof Client) {
        await message.reply(process.env.LASTLINKRECAP)
    }
}