import { Events } from "discord.js";
import LoadCommands from "../Loaders/Commands/LoadCommands.js";
const name = Events.GuildCreate;
const exec = async (bot, guild) => {
    console.log(bot.user?.tag, " a été ajouter a la guild :", guild.name);
    LoadCommands(bot);
};
export { name, exec };
