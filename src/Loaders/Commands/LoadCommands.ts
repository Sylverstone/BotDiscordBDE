import { readdirSync } from "fs";
import  * as path from "path";
import { SlashCommandBuilder, REST, Routes } from "discord.js";
import __dirname from "../../dirname.js";
import { pathToFileURL } from "url";
import CBot, { script_t } from "../../Class/CBot.js";
import "dotenv/config"

const setupLoad = async (bot : CBot, guildIds : string[]) =>
{
    const ext = ".js";

    const listeFileCommands = readdirSync(path.join(__dirname,"Commands"))
        .filter(file => file.endsWith(ext))
        .map(file => path.join(__dirname,"Commands", file));

    const additionalFile = ["Event","Reunion"];
    for(let dos of additionalFile)
    {
        const additionalScript = readdirSync(path.join(__dirname, "Commands", dos)).filter(
            file => !file.startsWith("_")
        ).map(file => path.join(__dirname,"Commands",dos,file));
        listeFileCommands.push(...additionalScript);
    }

    let SlashCommands : Array<SlashCommandBuilder> = [];
    for(const file of listeFileCommands)
    {
        const fileUrl = pathToFileURL(file).href
        
        const commande : script_t = await import(fileUrl);
        bot.commands.set(commande.name, commande)
        
        //creation de la slash commande
        let slashCommand = new SlashCommandBuilder()
            .setName(commande.name)
            .setDescription(commande.description)

        //Récupération des options de la slashCommand
        if(commande.option !== undefined)
        {
            for(const option of commande.option) {
                slashCommand.addStringOption(option);
            }
        }
        if(commande.optionInt !== undefined)
        {
            for(const option of commande.optionInt)
            {
                slashCommand.addIntegerOption(option);
            }
        }
        if(commande.optionUser !== undefined)
        {
            for (const option of commande.optionUser)
            {
                slashCommand.addUserOption(option);
            }
        }
        if(commande.optionNum !== undefined)
        {
            for (const option of commande.optionNum)
            {
                slashCommand.addNumberOption(option);
            }
        }
        if(commande.optionBoolean !== undefined)
        {
            for (const option of commande.optionBoolean)
            {
                slashCommand.addBooleanOption(option);
            }
        }
        SlashCommands.push(slashCommand);
    }

    if(!(typeof process.env.TOKEN === 'string')) return;
    
    const clientId : string | undefined = process.env.CLIENTID;
    if(!(typeof clientId === 'string')) return;
    const rest = new REST().setToken(process.env.TOKEN);
    
    await (async () => {
        try {
            console.log(`Started refreshing ${SlashCommands.length} application (/) SlashCommands.`);
            //permet au slash commande d'être visible sur le serveur
            console.log("guilds of bots :", guildIds);
            //load commands for every guild
            for(const guildId of guildIds)
            {
                bot.setDefaultReunionDataGuild(+guildId)
                bot.setDefaultEventDataGuild(+guildId);
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: SlashCommands },
                );
            }
            console.log(`Successfully reloaded ${listeFileCommands.length} application (/) SlashCommands.`);
        }catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
            throw error;
        }
    })();
}

export const loadCommandOnServer = async (bot : CBot, guildId : string) =>
{
    const guildIds = [guildId];
    await setupLoad(bot, guildIds);
}

export const loadCommandsOnAllServers = async (bot : CBot)=> 
{
    const guildIds = bot.guilds.cache.map(guild => guild.id);
    await setupLoad(bot,guildIds);
}