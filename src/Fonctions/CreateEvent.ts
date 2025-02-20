import { CommandInteraction, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";

export default async function CreateEvent(message : CommandInteraction,sujet : string, dateDebut : Date, dateFin : Date,
    lieu : string, more : string, typeEvent : string)
{
    if(!message.guild) return;
    await message.guild.scheduledEvents.create({
        name : `${typeEvent} ${dateDebut.getDate()}/${dateDebut.getMonth()+1}`,
        scheduledStartTime : dateDebut,
        scheduledEndTime : dateFin,
        privacyLevel :GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType : GuildScheduledEventEntityType.External,
        entityMetadata : {
            location : lieu
        },
        description : `Sujet : ${sujet}\n${more}`
    });
}