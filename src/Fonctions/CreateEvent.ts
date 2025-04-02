import {
    CommandInteraction,
    EmbedBuilder,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    ModalSubmitInteraction
} from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";
import date from "../Class/Date/Date.js";

export default async function CreateEvent(message : CommandInteraction | ModalSubmitInteraction,sujet : string, dateDebut : date, dateFin : date,
    lieu : string, more : string, name : string = "") : Promise<string | undefined>
{
    if(!message.guild) return;
    
    await message.guild.scheduledEvents.create({
        name : name,
        scheduledStartTime : dateDebut.toDate(),
        scheduledEndTime : dateFin.toDate(),
        
        privacyLevel :GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType : GuildScheduledEventEntityType.External,
        entityMetadata : {
            location : lieu,
        },
        description : `Sujet : ${sujet}\n> ${more}\n`,
    })
    return name;

    
}