
import { Events, Guild } from "discord.js"
import __dirname from "../dirname.js";
import CBot from "../Class/CBot.js";
import LoadCommands from "../Loaders/Commands/LoadCommands.js";

const name = Events.GuildCreate;

const exec = async (bot : CBot, guild : Guild) =>  {
    console.log(bot.user?.tag, " a été ajouter a la guild :",guild.name)
    await LoadCommands(bot);
}

export{name,exec}
