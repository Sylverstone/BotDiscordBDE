import { Events } from "discord.js";
import { loadCommandOnServer } from "../Loaders/Commands/LoadCommands.js";
const name = Events.GuildCreate;
const exec = async (bot, guild) => {
    console.log(bot.user?.tag, " a été ajouter a la guild :", guild.name, ". GuildId :", guild.id);
    await loadCommandOnServer(bot, guild.id);
};
export { name, exec };
