import { Client } from "discord.js";
import dotenv from "dotenv"
dotenv.config();

export const description = "Commandes écrivant le récap en entier dans tchat";
export const name = "recapdirect";

export const  run = async(bot, message, args) => {
    if (bot instanceof Client) {
        await message.reply("le recap en entier :)")
    }
}