import { Client, SlashCommandStringOption, CommandInteraction, Message } from "discord.js";
import { changeValueFromFile } from "../Fonctions/changeValueFromFile.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();


export const description = "Cette commande permet de recuperer/set le dernier récap";
export const name = "recap";

export const howToUse = "`/recap` vous permet de faire *2* choses.\nPremière utilisation : `/recap` en entrant cette commande il vous sera retourner le lien OneDrive du dernier récap de reunion.\nDeuxième utilisation : `/recap paramètre` Ici le 'paramètre' est le lien du nouveau recap, alors la commande sauvegarder le nouveau lien."

export const option = new SlashCommandStringOption()
        .setName("lien_recap")
        .setDescription("Paramètre permettant de mettre un nouveau recap")
        .setRequired(false);
        
export const run = async(bot, message, args = [null]) => {
    
        try
        {
            if (bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message)) {
                console.log(message.author.username,"is running recap")
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
               let version = 0;
               if(message instanceof Message)
               {
                    version = 1
               }
               if(args.length === 0)
                {
                    args = [null];
                }
               handleRun(version,args,message)

            }
           
        }
        catch(error)
        {
            console.log("command went wrong while",message.author.username,"was running it\n",error)
            await message.reply("Une erreur s'est produite, veuillez contacter un développeur!");
        }
}
 async function handleRun(version,args,message)
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
            if(lienOnedrive === "")
            {
                 
                return message.reply("Il n'y a pas de lien de recap actuellement :(");;
            }
            return message.reply(`Le lien onedrive recap est actuellement : ${lienOnedrive}`);
        }
        console.log("command success, author:",message.author.username)
    
    }