import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
export default async function CreateEvent(message, sujet, dateDebut, dateFin, lieu, more, typeEvent, id, temoin) {
    if (!message.guild)
        return;
    let name_have_been_changed = false;
    let i = 0;
    let name = `${typeEvent} ${dateDebut.getDate()}/${dateDebut.getMonth() + 1}`;
    let EventNameList = await message.guild.scheduledEvents.fetch();
    //réduire les possibilités
    EventNameList = EventNameList.filter(e => e.name.startsWith(name));
    while (!(typeof EventNameList.find(e => e.name === name) === "undefined")) {
        name_have_been_changed = true;
        i++;
        name = `${typeEvent} ${dateDebut.getDate()}/${dateDebut.getMonth() + 1} (${i})`;
        if (i > 100) {
            throw new Error("Too many iterations on i (CreateEvents.ts)");
        }
    }
    if (typeof temoin !== "undefined") {
        temoin[0] = name;
    }
    await message.guild.scheduledEvents.create({
        name: name,
        scheduledStartTime: dateDebut,
        scheduledEndTime: dateFin,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: {
            location: lieu,
        },
        description: `Sujet : ${sujet}\n${more}\nid : ${id}`,
    });
    return name;
}
