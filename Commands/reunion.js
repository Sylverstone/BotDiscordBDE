import {Client, CommandInteraction, Message, SlashCommandBuilder, SlashCommandStringOption} from 'discord.js';
import events from "events";
import readline from 'readline';
import { changeValueFromFile } from '../Fonctions/changeValueFromFile.js';
import fs from "fs";
import verifierDate from '../Fonctions/DateScript.js';

const description = "Cette commande permet de récuperer/set la prochaine reunion";

const name = "reunion";

const option = new SlashCommandStringOption()
    .setName("date_reunion")
    .setRequired(false)
    .setDescription("Paramètre permettant de définir une nouvelles dates :)")
    

const run = async (bot, message, args = [null]) =>
{
    try {

        if(bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message))
        {
            let version = 0;
            if(message instanceof Message)
            {
                version = 1
            }
            if(args.length === 0)
            {
                args = [null];
            }
            handleRun(version, args,message)
            
        }
        
    } catch (error) {
        console.log(error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};


export{description,name,run,option}

async function handleRun(version,args,message)
    
{
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
    },args,version);
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