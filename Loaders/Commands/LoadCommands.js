import { readdirSync } from "fs";
import path from "path";
import { SlashCommandBuilder, REST, Routes } from "discord.js";
import dotenv from "dotenv"
import __dirname from "../../dirname.js";
import { fileURLToPath, pathToFileURL } from "url";
dotenv.config();

export default async () => 
{
    const ext = ".js"
    const listeFileCommands = readdirSync("Commands").filter(file => file.endsWith(ext)).map(file => file.slice(0, file.length - ext.length));
    let commands = [];
   
    for(const file of listeFileCommands)
    {
        const filePath = path.join(__dirname, "Commands",file + ext);
        const fileUrl = pathToFileURL(filePath).href
        console.log("file : ",filePath,"\n"+fileUrl);
        console.log(__dirname)
        
        const commande = await import(fileUrl);
        console.log(commande.description, commande.name);
        //creation de la slash commande
        let slashCommand = new SlashCommandBuilder()
            .setName(commande.name)
            .setDescription(commande.description)
        
        if(commande.option != undefined)
        {
            slashCommand.addStringOption(commande.option);
        }

        commands.push(slashCommand);
    }

    const rest = new REST().setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            //permet au slash commande d'être visible sur le serveur
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
                { body: commands },
            );
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            
            console.error(error);
        }
    })();
}