import { Client, SlashCommandStringOption, CommandInteraction, Message } from "discord.js";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import dotenv from "dotenv";
import EmptyObject from "../Fonctions/LookIfObjectIsEmpty.js";

dotenv.config();


export const description = "Cette commande permet de recuperer/set le dernier récap";
export const name = "recap";

export const howToUse = "`/recap` vous permet de faire *2* choses.\nPremière utilisation : `/recap` en entrant cette commande il vous sera retourner le lien OneDrive du dernier récap de reunion.\nDeuxième utilisation : `/recap paramètre` Ici le 'paramètre' est le lien du nouveau recap, alors la commande sauvegarder le nouveau lien."

export const option = new SlashCommandStringOption()
        .setName("lien_recap")
        .setDescription("Paramètre permettant de mettre un nouveau recap")
        .setRequired(false);
    

        

export const run = async(bot, message) => {
    
        try
        {
            if (bot instanceof Client && (message instanceof CommandInteraction)) {
               console.log(message.user,"is running recap")            
               handleRun(bot,message)
            }
           
        }
        catch(error)
        {
            console.log("command went wrong while",message.user,"was running it\n",error)
            await message.reply("Une erreur s'est produite, veuillez contacter un développeur!");
        }
}
 async function handleRun(bot,message)
    {
        
        let haveParameters = false;
        haveParameters = message.options.data.length >= 1;
    
        //quand retourVal est true, ça veut dire qu'il y avait des parametres dans la commande
        //quand il n'y a pas de parametre, ça veut dire que c'est une commande pour set
        if(haveParameters)
        {
            SaveValueToDB(message,bot,"recapitulatif")
            .then(result => {
                console.log("command succes -author:",message.user);
                return message.reply({content : `Le changement a bien été fait ! :)`})
            })
            .catch(err => {throw err});
        }       

        else
        {
            await getMostRecentValueFromDB(message,"lien_recap","recapitulatif","idRecap",bot)
            .then(async(result) => {
                
                
                if(EmptyObject(result))
                {
                    return message.reply("Il n'y a pas de lien de recap actuellement :(");;
                }
                const {lien_recap} = result;
                return message.reply(`Le lien onedrive recap est actuellement : ${lien_recap}`);
                
            }).catch(async(err) => {
                console.error(err);
                return message.reply("Une erreur est survenue lors de l'exécution de cette commande :(");
            });
            
        }
        console.log("command success, author:",message.user)
    
    }