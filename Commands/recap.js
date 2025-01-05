import { Client, SlashCommandStringOption, CommandInteraction } from "discord.js";
import { changeValueFromFile } from "../Fonctions/scripts.js";
import dotenv from "dotenv";

dotenv.config();
const handleRun = async (version,args,message) =>
{
    if(args.length === 0)
    {
        args = [null];
    }
    let {option, jsonData} = changeValueFromFile("lien_recap",message,"lienOnedrive", async (ancienneValeur,value,message,jsonData) => {
        const jsonMisAjour = JSON.stringify(jsonData,null,4);
        fs.writeFileSync("JSON/data.json", jsonMisAjour);

        await message.reply(`Le lien du recap a bien été modifié! (${ancienneValeur}->${value})`);
    }, args,version);
    console.log("here")
    console.log(option,jsonData);
    if(option === null) 
    {
        console.log("here")
        const lienOnedrive = jsonData.lienOnedrive;
        await message.reply(`Le lien onedrive recap est actuellement : ${lienOnedrive}`);
    }

}

export const description = "Commande donnant un lien OneDrive vers le dernier récaps de reunions";
export const name = "recap";
export const option = new SlashCommandStringOption()
        .setName("lien_recap")
        .setDescription("Paramètre permettant de mettre un nouveau recap")
        .setRequired(false);
        
export const run = async(bot, message, args) => {
    
        try
        {
            if (bot instanceof Client && message instanceof CommandInteraction && message.isChatInputCommand()) {
                /*
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
                }*/
               handleRun(0,[],message)

            }else 
            {
                handleRun(1,args,message)
            }
        }
        catch(error)
        {
            console.log(error);
            await message.reply("Une erreur s'est produite, veuillez contacter un développeur!");
        }
}

