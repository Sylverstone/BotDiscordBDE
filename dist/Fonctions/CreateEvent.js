import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
export default async function CreateEvent(message, sujet, dateDebut, dateFin, lieu, more, typeEvent) {
    if (!message.guild)
        return;
    await message.guild.scheduledEvents.create({
        name: `${typeEvent} -> ${sujet}`,
        scheduledStartTime: dateDebut,
        scheduledEndTime: dateFin,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: {
            location: lieu
        },
        description: more
    });
}
