import { readdirSync } from "fs";
import * as path from "path";
import { SlashCommandBuilder, REST, Routes } from "discord.js";
import "dotenv/config";
import __dirname from "../../dirname.js";
import { pathToFileURL } from "url";
const setupLoad = async (bot, guildIds) => {
    const ext = ".js";
    const listeFileCommands = readdirSync(path.join("dist", "Commands")).filter(file => file.endsWith(ext)).map(file => file.slice(0, file.length - ext.length));
    let SlashCommands = [];
    for (const file of listeFileCommands) {
        const filePath = path.join(__dirname, "Commands", file + ext);
        const fileUrl = pathToFileURL(filePath).href;
        const commande = await import(fileUrl);
        bot.commands.set(commande.name, commande);
        //creation de la slash commande
        let slashCommand = new SlashCommandBuilder()
            .setName(commande.name)
            .setDescription(commande.description);
        if (commande.option !== undefined) {
            for (const option of commande.option) {
                slashCommand.addStringOption(option);
            }
        }
        if (commande.optionInt !== undefined) {
            for (const option of commande.optionInt) {
                slashCommand.addIntegerOption(option);
            }
        }
        if (commande.optionUser !== undefined) {
            for (const option of commande.optionUser) {
                slashCommand.addUserOption(option);
            }
        }
        if (commande.optionNum !== undefined) {
            for (const option of commande.optionNum) {
                slashCommand.addNumberOption(option);
            }
        }
        SlashCommands.push(slashCommand);
    }
    if (!(typeof process.env.TOKEN === 'string'))
        return;
    const clientId = process.env.CLIENTID;
    if (!(typeof clientId === 'string'))
        return;
    const rest = new REST().setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log(`Started refreshing ${SlashCommands.length} application (/) SlashCommands.`);
            //permet au slash commande d'être visible sur le serveur
            console.log("guilds of bots :", guildIds);
            //load commands for every guild
            for (const guildId of guildIds) {
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: SlashCommands });
            }
            console.log(`Successfully reloaded ${listeFileCommands.length} application (/) SlashCommands.`);
        }
        catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
            throw error;
        }
    })();
};
export const loadCommandOnServer = async (bot, guildId) => {
    const guildIds = [guildId];
    await setupLoad(bot, guildIds);
};
export const loadCommandsOnAllServers = async (bot) => {
    const guildIds = bot.guilds.cache.map(guild => guild.id);
    await setupLoad(bot, guildIds);
};
