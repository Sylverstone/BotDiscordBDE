import {Client, CommandInteraction, Message, SlashCommandBuilder, SlashCommandStringOption} from 'discord.js';
import events from "events";
import readline from 'readline';
import { changeValueFromFile } from '../Fonctions/scripts.js';
import fs from "fs";

const description = "Avec cette commande vous pouvez planifié/avoir la date d'une reunion";

const name = "reunion";

const option = new SlashCommandStringOption()
    .setName("date_reunion")
    .setRequired(false)
    .setDescription("Paramètre permettant de définir une nouvelles dates :)")
    
const run = async (bot, message, args) =>
{
    try {

        if(bot instanceof Client && message instanceof CommandInteraction && message.isChatInputCommand())
        {
            /*
            const options = message.options.get("date_reunion");
            const jsonData = await import("../JSON/data.json");

            if(options !== null)
            {
                const {value} = option;
                const ancienneValeur = jsonData.prochaineReunion;
                jsonData.prochaineReunion = value;

                if(!verifierDate(ancienneValeur,value))
                {
                    await message.reply(`La nouvelles date de reunion que tu essaies d'entrer est inférieur a l'ancienne :) PAS LOGIQUE`)
                }
                else 
                {
                    const newJson = JSON.stringify(jsonData, null, 4);
                    fs.writeFileSync("data.json", newJson);
                    await message.reply(`La nouvelle date de reunion a bien été enregistré ! (${ancienneValeur}->${value})`);
                }
            }
                */
            let {option, jsonData} = changeValueFromFile("date_reunion",message,"prochaineReunion", async (ancienneValeur,value,message,jsonData) => {
                console.log("start")
                if(!verifierDate(ancienneValeur,value))
                    {
                        await message.reply(`La nouvelles date de reunion que tu essaies d'entrer est inférieur a l'ancienne :) Ce n'est donc pas possible`);
                    }
                    else 
                    {
                        const newJson = JSON.stringify(jsonData, null, 4);
                        fs.writeFileSync("data.json", newJson);
                        await message.reply(`La nouvelle date de reunion a bien été enregistré ! (${ancienneValeur}->${value})`);
                    }
            } );
            console.log("finish")
            
            if(option === null) {
                console.log(jsonData)
                const date = jsonData.prochaineReunion;
                console.log(date);

                const [jour, mois, annee] = date.split("/");
                const datefr = jour+"/"+mois+"/"+annee;
                const prochaineReunion = new Date(`${annee}-${mois}-${jour}`);
                const dateActu = new Date();
                if(prochaineReunion > dateActu)
                {
                    await message.reply("La prochaine réunion est planifié au " + datefr)
                }
                else
                {
                    await message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.\nLa dernière date du " + datefr);
                }
            }
            
        }
        else if(message instanceof Message && args instanceof Array)
        {
           
            
            await message.reply("t'inquiète ça va le faire")
        }
    } catch (error) {
        console.log(error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};

const convertToDate = (date) => {
    const [jour, mois, annee] = date.split("/");
    const dateOrigine = jour+"/"+mois+"/"+annee;
    return new Date(`${annee}-${mois}-${jour}`);
}
function verifierDate(dateOrigine,NouvelleDate)
{
    dateOrigine = convertToDate(dateOrigine);
    NouvelleDate = convertToDate(NouvelleDate);
    return NouvelleDate > dateOrigine && (NouvelleDate instanceof Date && dateOrigine instanceof Date);
}
export{description,name,run,option}
