import { CommandInteraction, EmbedBuilder, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";

export default async function CreateEvent(message : CommandInteraction,sujet : string, dateDebut : Date, dateFin : Date,
    lieu : string, more : string, id : number, name : string = "") : Promise<string | undefined>
{
    if(!message.guild) return;
    
    
    await message.guild.scheduledEvents.create({
        name : name,
        scheduledStartTime : dateDebut,
        scheduledEndTime : dateFin,
        
        privacyLevel :GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType : GuildScheduledEventEntityType.External,
        entityMetadata : {
            location : lieu,
            
        },
        description : `Sujet : ${sujet}\n${more}\nid : ${id}`,
    })
    return name;

    
}