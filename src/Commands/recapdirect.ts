import { CommandInteraction } from "discord.js";
import "dotenv/config"
import CBot from "../Class/CBot";

export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "recapdirect";
export const onlyGuild = true;
export const howToUse = "Vous n'avez qu'a tapez `/recapdirect` et la commande renverra le dernier récap dans le chat directement";

export const  run = async(bot : CBot, message : CommandInteraction) => {
    await message.reply("le recap en entier :) (flemme de faire ça mais si c'est demandé je fais)")
    
}