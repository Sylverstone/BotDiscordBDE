import { CommandInteraction, EmbedBuilder,hyperlink, SlashCommandIntegerOption,SlashCommandStringOption } from "discord.js";
import { createDate } from "../Fonctions/DateScript.js";
import { SaveValueToDB,  getValueFromDB } from "../Fonctions/DbFunctions.js";
import 'dotenv/config'
import __dirname from "../dirname.js";
import transfromOptionToObject from "../Fonctions/transfromOptionToObject.js";
import CBot from "../Class/CBot.js";
import CreateEvent from "../Fonctions/CreateEvent.js";
import handleError from "../Fonctions/handleError.js";

export const description = "Cette commande vous renvoie les infos du prochain Event de votre serveur";
export const name = "supEv";

export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/event` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event name date more` Ici les Concerne des nou"

export const option = [
    new SlashCommandStringOption()
    .setName("reunion_name")
    .setDescription("le nom de la reunion ")
    .setRequired(false),
];

export const onlyGuild = true;






export const  run = async(bot : CBot, message : CommandInteraction) => {
    try 
    {
        const nomEv = message.options.get("reunion_name");
        const guild = message.guild;
        if(!guild)
        {
            return message.reply("not a guild");
        }
        else
        {
            const events = await guild.scheduledEvents.fetch();
            const event = events.find(e => e.name.toLowerCase() === nomEv.toLowerCase())
            if(event)
            {
                await event.delete()
                return message.reply("good");
            }
            return message.reply(" no ev ")
        }
    }
}
