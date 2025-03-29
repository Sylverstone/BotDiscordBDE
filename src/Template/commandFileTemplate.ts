import {CommandInteraction,EmbedBuilder,MessageFlags,SlashCommandStringOption } from "discord.js";
import "dotenv/config";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import make_log from "../Fonctions/makeLog.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";

export const description = "";
export const name = "";
export const onlyGuild = true;


export const howToUse = "";

export const  run = async(bot : CBot, message : CommandInteraction) => {
    try{

    }
    catch(error)
    {
        if(error instanceof Error)
            handleError(message,error,true);
    }


}