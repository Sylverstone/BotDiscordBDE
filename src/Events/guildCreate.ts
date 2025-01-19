
import { Events, Guild } from "discord.js"
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";
import {loadCommandOnServer} from "../Loaders/Commands/LoadCommands.js";

const name = Events.GuildCreate;

const exec = async (bot : CBot, guild : Guild) =>  {
    console.log(bot.user?.tag, " a été ajouter a la guild :",guild.name,". GuildId :",guild.id);
    await loadCommandOnServer(bot,guild.id);
}

export{name,exec}
