import { Client, SlashCommandStringOption, CommandInteraction } from "discord.js";
import { changeValueFromFile } from "../Fonctions/scripts.js";
import dotenv from "dotenv";

dotenv.config();

export const description = "Commande donnant un lien OneDrive vers le dernier récaps de reunions";
export const name = "recap";
export const option = new SlashCommandStringOption()
        .setName("lien_recap")
        .setDescription("Paramètre permettant de mettre un nouveau recap")
        .setRequired(false);
        
export const run = async(bot, message, args) => {
    
        try
        {
            if (bot instanceof Client && message instanceof CommandInteraction) {
                /*
                const option = message.options.get("lien recap");                
                const jsonData = await import("../JSON/data.json");
                
                if(option !== null)
                {
                    const {value} = option;
                    const ancienneValeur = jsonData.lienOnedrive;
                    jsonData.lienOnedrive = value;

                    const jsonMisAjour = JSON.stringify(jsonData,null,4);
                    fs.writeFileSync("data.json", jsonMisAjour);

                    await message.reply(`Le lien du recap a bien été modifié! (${ancienneValeur}->${value})`);
                }
                */
                console.log("here")
                let {option, jsonData} = changeValueFromFile("lien_recap",message,"lienOnedrive", async (ancienneValeur,value,message,jsonData) => {
                    const jsonMisAjour = JSON.stringify(jsonData,null,4);
                    fs.writeFileSync("JSON/data.json", jsonMisAjour);

                    await message.reply(`Le lien du recap a bien été modifié! (${ancienneValeur}->${value})`);
                });
                console.log("here")
                console.log(option,jsonData);
                if(option === null) 
                {
                    console.log("here")
                    const lienOnedrive = jsonData.lienOnedrive;
                    await message.reply(`Le lien onedrive recap est actuellement : ${lienOnedrive}`);
                }

            }
        }
        catch(error)
        {
            console.log(error);
            await message.reply("Une erreur s'est produite, veuillez contacter un développeur!");
        }
}
