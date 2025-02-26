import { CommandInteraction, EmbedBuilder, MessageFlags, SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";
import 'dotenv/config'
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import { deleteFromTableWithId, deleteFromTableWithName } from "../Fonctions/DbFunctions.js";
import { createDate } from "../Fonctions/DateScript.js";
import make_log from "../Fonctions/makeLog.js";
import { EVentType } from "../Enum/EventType.js";
import { Event } from "../Enum/Event.js";
import { Reunion } from "../Enum/Reunion.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";


export const description = "Cette commande vous permet de supprimer une réunion";
export const name = "sup_event";

export const howToUse = "`/sup_event 'nom_reunion'` vous permet de supprimer un evènement grâce a son nom"

export const option = [
    new SlashCommandStringOption()
    .setName("nom_reunion")
    .setDescription("le nom de la reunion")    
    .setRequired(true)
];


export const onlyGuild = true;
type sup_event_run_t = (bot : CBot, message : CommandInteraction, typeEvent : EVentType) => undefined;

export const  run = async(bot : CBot, message : CommandInteraction, typeEvent : EVentType) => {
    try 
    {
        await message.deferReply({flags : MessageFlags.Ephemeral});
        const nomEv = message.options.get("nom_reunion");
;
        const nom = nomEv?.value;
        if(!(typeof nom === "string")) return message.editReply(typeof nom);
        const guild = message.guild;
        if(!guild)
        {
            make_log(true,message);
            return message.editReply("not a guild");
        }
        else
        {
            const events = await guild.scheduledEvents.fetch();
            const event = events.find(e => 
                {
                    if(e.scheduledStartTimestamp)
                    {
                        const temp_date = new Date(e.scheduledStartTimestamp);
                        return e.name.toLowerCase() === nom.toLowerCase() && temp_date.getTime()
                    }                    
                }
            );

            if(event)
            {
                const champName = typeEvent === EVentType.Event ? Event.name : Reunion.name;
                const table = typeEvent === EVentType.Event ? Event.tableName : Reunion.tableName;
                console.log(event)
                await event.delete()
                if(!message.guild) return;
                await deleteFromTableWithName(table,champName,event.name,bot,+message.guild.id)
                displayEmbedsMessage(message, new EmbedBuilder()
                                                .setTitle("Information")
                                                .setDescription("L'évènement a été supprimé"),true)

                return;
            }
            make_log(true,message);
            displayEmbedsMessage(message, new EmbedBuilder()
                                                .setTitle("Information")
                                                .setDescription("Aucun Event de ce nom n'existe"),true)
            return;
        }
        
    }
    catch(Err)
    {
        if(Err instanceof Error)
        {
            handleError(message,Err,true);
        }
        
    }
}
