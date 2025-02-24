import { CommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import "dotenv/config"
import CBot from "../Class/CBot";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import { deleteFromTableWithName } from "../Fonctions/DbFunctions.js";
import { Reunion } from "../Enum/Reunion.js";
import { Event } from "../Enum/Event.js";
import handleError from "../Fonctions/handleError.js";

export const description = "Cette commande supprimera touts les Evènements de votre serveur discord";
export const name = "sup_all_events";
export const onlyGuild = true;
export const howToUse = "Vous n'avez qu'a tapez `/sup_events` et la commande rsupprimera tout les évènements du discord";

export const  run = async(bot : CBot, message : CommandInteraction) => {
    if(!message.guild) return;

    await message.deferReply({flags : MessageFlags.Ephemeral});
    
    try
    {
        const Events = message.guild.scheduledEvents.cache;
        if(Events.size > 0)
        {
            Events.forEach(event => {
                let tableName : string;
                let champName : string;
                if(event.name.startsWith("Reunion"))
                {
                    tableName = Reunion.tableName;
                    champName = Reunion.name;
                }
                else
                {
                    tableName = Event.tableName;
                    champName = Event.name;
                }
                if(!message.guild) return;
                deleteFromTableWithName(tableName,champName,event.name,bot,+message.guild.id)
                .then(() => 
                {
                    return event.delete();    
                })
                .then((status) => {
                    console.log(`Event ${status.name} deleted`);
                    
                }).catch(err => {
                    throw err;
                })
                
            })
    
            return displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Information")
                .setDescription("Fini :)"),true);
        }
        else
        {
            return displayEmbedsMessage(message, new EmbedBuilder()
                                                    .setTitle("Information")
                                                    .setDescription("Il n'y a pas d'évènement"),true);                                         
        }   
    }
    catch(Err)
    {
        if(Err instanceof Error)
        {
            handleError(message,Err);
        }
       
    }
    

}