import { readdirSync } from "fs";
import path from "path";
import { SlashCommandBuilder, REST, Routes, Client, Collection } from "discord.js";
import dotenv from "dotenv"
import __dirname from "../../dirname.js";
import { pathToFileURL } from "url";
dotenv.config();

export default async (bot) => 
{
    if(bot instanceof Client)
    {

        const ext = ".js"
        const listeFileCommands = readdirSync("Commands").filter(file => file.endsWith(ext)).map(file => file.slice(0, file.length - ext.length));
        let commands = [];
    
        for(const file of listeFileCommands)
        {
            const filePath = path.join(__dirname, "Commands",file + ext);
            const fileUrl = pathToFileURL(filePath).href
            
            const commande = await import(fileUrl);
            if(commande.notAcommand) continue;
            if(bot.commands instanceof Collection)
            {
                bot.commands.set(commande.name, commande);
            }
            //creation de la slash commande
            let slashCommand = new SlashCommandBuilder()
                .setName(commande.name)
                .setDescription(commande.description)
            
            if(commande.option != undefined)
            {
                if(!(commande.option instanceof Array))
                {
                    slashCommand.addStringOption(commande.option);
                }
                else
                {
                    for(const option of commande.option)
                    {
                        slashCommand.addStringOption(option);
                    }
                }

                
                
            }
            if(commande.optionInt !== undefined)
            {
                if(!(commande.optionInt instanceof Array))
                    {
                        slashCommand.addIntegerOption(commande.optionInt);
                    }
                    else
                    {
                        for(const option of commande.optionInt)
                        {
                            slashCommand.addIntegerOption(option);
                        }
                    }
            }
            
            commands.push(slashCommand);
        }

        const rest = new REST().setToken(process.env.TOKEN);
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                //permet au slash commande d'être visible sur le serveur
                const guildIds = bot.guilds.cache.map(guild => guild.id)
                console.log("guilds of bots :", guildIds);
                let data;
                for(const guildId of guildIds)
                {
                    data = await rest.put(
                        Routes.applicationGuildCommands(process.env.CLIENTID, guildId),
                        { body: commands },
                    );
                }
                
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                
                console.error("error while loading commands\n", error);
                throw error;
            }
        })();
    }
}