import { Events } from "discord.js";
import { deleteFromTableWithName } from "../Fonctions/DbFunctions.js";
import { Reunion } from "../Enum/Reunion.js";
import { Event } from "../Enum/Event.js";
const name = Events.GuildScheduledEventDelete;
const exec = async (bot, event) => {
    try {
        const tableName = event.name.startsWith("Reunion") ? Reunion.tableName : Event.tableName;
        const champName = tableName === Reunion.tableName ? Reunion.name : Event.name;
        if (!event.guild)
            return;
        await deleteFromTableWithName(tableName, champName, event.name, bot, +event.guild.id);
        console.log("Event :", event.name, "was deleted");
    }
    catch (err) {
        console.error(err);
    }
};
export { name, exec };
