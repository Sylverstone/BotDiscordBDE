import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
export default async function CreateEvent(message, sujet, dateDebut, dateFin, lieu, more, name = "") {
    if (!message.guild)
        return;
    await message.guild.scheduledEvents.create({
        name: name,
        scheduledStartTime: dateDebut.toDate(),
        scheduledEndTime: dateFin.toDate(),
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: {
            location: lieu,
        },
        description: `Sujet : ${sujet}\n${more}\n`,
    });
    return name;
}
