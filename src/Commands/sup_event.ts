import { CommandInteraction, EmbedBuilder, MessageFlags, SlashCommandStringOption } from "discord.js";
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import { deleteFromTableWithName } from "../Fonctions/DbFunctions.js";
import make_log from "../Fonctions/makeLog.js";
import { EVentType } from "../Enum/EventType.js";
import { Event } from "../Enum/Event.js";
import { Reunion } from "../Enum/Reunion.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import 'dotenv/config'

export const description = "Cette commande vous permet de supprimer un évènement grâce a son nom";
export const name = "sup_event";

export const howToUse = "`/sup_event 'nom_reunion'` vous permet de supprimer un evènement grâce a son nom"

export const option = [
    new SlashCommandStringOption()
    .setName("nom_reunion")
    .setDescription("le nom de la reunion")    
    .setRequired(true)
];


export const onlyGuild = true;

export const  run = async(bot : CBot, message : CommandInteraction, typeEvent : EVentType) => {
    try 
    {
        await message.deferReply({flags : MessageFlags.Ephemeral});
        const nomEv = message.options.get("nom_reunion");
;
        const nom = nomEv?.value;
        if(!(typeof nom === "string")) throw new Error("Le nom de la reunion n'a pas été renseigné");
        const guild = message.guild;
        if(!guild)
        {
            throw new Error("Guild inexistante");
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
                if(!message.guild) throw new Error("Guild not found");
                await deleteFromTableWithName(table,champName,event.name,bot,+message.guild.id)
                await displayEmbedsMessage(message, new EmbedBuilder()
                                                .setTitle("Information")
                                                .setDescription("L'évènement a été supprimé"),true)

                return make_log(true,message);
            }
            
            await displayEmbedsMessage(message, new EmbedBuilder()
                                                .setTitle("Information")
                                                .setDescription("Aucun Event de ce nom n'existe"),true)
            return make_log(true,message);;
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
