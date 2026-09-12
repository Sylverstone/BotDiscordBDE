import {
    ActionRowBuilder,
    CommandInteraction,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ComponentType, EmbedBuilder, SlashCommandChannelOption, ChatInputCommandInteraction, MessageFlags
} from "discord.js";

import "dotenv/config"
import * as path from "path";
import * as fs from "fs";
import __dirname from "../dirname.js";
import CBot, { isScript_t} from "../Class/CBot.js";
import { pathToFileURL } from "url";

import handleError from "../Fonctions/handleError.js";
import {Color} from "../Enum/Color.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import {setReunionSalonId} from "../Fonctions/DbFunctions.js";

export const description = "Cette commande vous permettra d'en apprendre plus sur l'utilisation d'une commande";
export const name = "set_salon_reunion";

export const howToUse = "J'imagine que vous savez déjà utilsier /man :)"
export const onlyGuild = true;

export const optionChannel = [
    new SlashCommandChannelOption()
        .setName("salon_de_reunion")
        .setDescription("Le salon dans lequel le bot enverra les rappels de réunion")
        .setRequired(true)


];

export const  run = async(bot : CBot, message : ChatInputCommandInteraction) => {
    try {
        await message.deferReply({ flags : [MessageFlags.Ephemeral]})
       const salonReunion = message.options.getChannel("salon_de_reunion", true);

       if(!message.guild)
           return;
       const GuildChannel = await message.guild.channels.fetch(salonReunion.id
       );

       if(!GuildChannel)
           return;

       if(!GuildChannel.isSendable())
           return;

       //

       await setReunionSalonId(bot,message.guild.id, GuildChannel.id);

       return message.editReply({ content : "C'est fait !"});

    } 
    catch (error) {
        console.log(error);
        if(error instanceof Error)
            handleError(message,error);
    }
}