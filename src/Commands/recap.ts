import { SlashCommandStringOption, CommandInteraction} from "discord.js";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import "dotenv/config"
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import make_log from "../Fonctions/makeLog.js";


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
            handleRun(bot,message)
        }
        catch(error)
        {
            if(!(error instanceof Error)) return;
            handleError(message,error)
        }
}
 async function handleRun(bot : CBot,message : CommandInteraction)
    {
        
        let haveParameters = false;
        haveParameters = message.options.data.length >= 1;
    
        //quand retourVal est true, ça veut dire qu'il y avait des parametres dans la commande
        //quand il n'y a pas de parametre, ça veut dire que c'est une commande pour set
        if(haveParameters)
        {
            SaveValueToDB(message,bot,"recapitulatif",undefined,true)
            .then(result => {
                make_log(true,message);
                return message.reply({content : `Le changement a bien été fait ! :)`})
            })
            .catch(err => handleError(message,err));
        }     

        else
        {
            await getMostRecentValueFromDB(message,"lien_recap","recapitulatif","idRecap",bot)
            .then(async(result) => {
                if(result)
                {
                    make_log(true,message);
                    return message.reply(`Le lien du dernier récap est actuellement : ${result}`);
                }
                else
                {
                    make_log(true,message);
                    return message.reply("Il n'y a pas de lien de recap actuellement :(");
                }        
            }).catch(async(err) => {
                handleError(message, err);
            });
            
        }
        
    
    }