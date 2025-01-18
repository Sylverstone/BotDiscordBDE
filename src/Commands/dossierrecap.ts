import {CommandInteraction,SlashCommandStringOption } from "discord.js";
import "dotenv/config";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";

export const description = "Cette commande vous donnes le lien de l'endroit où sont stocker tout les récaps";
export const name = "dossierrecap";

export const option = new SlashCommandStringOption()
        .setName("lien_dossier_recap")
        .setDescription("Paramètre permettant de mettre le nouveau lien du dossier du récap")
        .setRequired(false);

export const howToUse = "Vous n'avez qu'a tapez `/dossierRecap` et la commande renverra le lien vers le dossier contenant tout les récap";

export const  run = async(bot : CBot, message : CommandInteraction) => {
    console.log(message.user, "is running dossierrecap")
    let haveParameters = false;
    haveParameters = message.options.data.length >= 1;

    if(!haveParameters)
    {
        getMostRecentValueFromDB(message,"lien_dossier_recap","DossierRecap","idDossierRecap",bot)
        .then(async (result : unknown) => {
            if(result)
            {
                await message.reply("Voici le lien vers le dossier de récap : "+ result);
            }
            else
            {
                await message.reply("Il n'y a pas de lien vers le dossier récap :(");
            }
            console.log("run with sucess. user :",message.user);
        })
        .catch(async err => {
            handleError(message,err);
        })
    }
    else
    {
        SaveValueToDB(message,bot,"DossierRecap",undefined,true)
        .then(result => {
            console.log("command success, author:",message.user);
            return message.reply({content : `Le changement a bien été fait! :)`});
        })
        .catch(async err => {
            handleError(message,err);
        });
    }

}