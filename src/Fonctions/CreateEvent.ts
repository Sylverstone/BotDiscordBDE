import { CommandInteraction, EmbedBuilder, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";

export default async function CreateEvent(message : CommandInteraction,sujet : string, dateDebut : Date, dateFin : Date,
    lieu : string, more : string, typeEvent : string,id? : number,temoin? : string[]) : Promise<[boolean,string] | undefined>
{
    if(!message.guild) return;
    let name_have_been_changed = false;
    let i : number = 0;
    let name = `${typeEvent} ${dateDebut.getDate()}/${dateDebut.getMonth()+1}`;
    let EventNameList = await message.guild.scheduledEvents.fetch();
    //réduire les possibilités
    EventNameList = EventNameList.filter(e => e.name.startsWith(name));
    while (!(typeof EventNameList.find(e => e.name === name) === "undefined"))
    {
        name_have_been_changed = true;
        i++;
        name = `${typeEvent} ${dateDebut.getDate()}/${dateDebut.getMonth()+1} (${i})`;
        if(i > 100)
        {
            throw new Error("Too many iterations on i (CreateEvents.ts)");
        }
    }
    if(typeof temoin !== "undefined")
    {
        temoin[0] = name;
    }
    
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
    return [name_have_been_changed,name];

    
}