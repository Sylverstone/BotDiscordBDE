import { Client } from "discord.js";
import dotenv from "dotenv"
dotenv.config();

export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "recapdirect";

export const  run = async(bot, message, args) => {
    if (bot instanceof Client) {
        await message.reply("le recap en entier :)")
    }
}