import { SlashCommandStringOption, CommandInteraction, MessageFlags, EmbedBuilder} from "discord.js";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import "dotenv/config"
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import make_log from "../Fonctions/makeLog.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";


export const description = "Cette commande permet de recuperer/set le dernier récap";
export const name = "recap";

export const howToUse = "`/recap` vous permet de faire *2* choses.\nPremière utilisation : `/recap` en entrant cette commande il vous sera retourner le lien OneDrive du dernier récap de reunion.\nDeuxième utilisation : `/recap lien_recap` la commande sauvegarde le nouveau lien."
export const onlyGuild = true;

export const option = 
[
    new SlashCommandStringOption()
        .setName("lien_recap")
        .setDescription("Paramètre permettant de mettre un nouveau recap")
        .setRequired(false),
];
    
export const run = async(bot : CBot, message : CommandInteraction) => {
    try
    {        
        let haveParameters = false;
        haveParameters = message.options.data.length >= 1;
        
        if(haveParameters)
        {
            //saving value
            await message.deferReply({flags : MessageFlags.Ephemeral});
            SaveValueToDB(message,bot,"recapitulatif",undefined,true)
            .then(result => {
                make_log(true,message);
                displayEmbedsMessage(message, new EmbedBuilder()
                                                .setTitle("Information")
                                                .setDescription("Le changement a bien été fait :)"),true)
                return ;
            })
            .catch(err => {throw err});
        }  
        else
        {
            //getting value
            await message.deferReply();
            await getMostRecentValueFromDB(message,"lien_recap","recapitulatif","idRecap",bot)
            .then(async(result) => {
                if(result)
                {
                    make_log(true,message);
                    return message.editReply(`Le lien du dernier récap est actuellement : ${result}`);
                }
                else
                {
                    make_log(true,message);
                    return message.editReply("Il n'y a pas de lien de recap actuellement :(");
                }        
            }).catch(async(err) => {
                throw err;
            });
            
        }   
    }
    catch(error)
    {
        if(!(error instanceof Error)) return;
        handleError(message,error,true);
    }
}