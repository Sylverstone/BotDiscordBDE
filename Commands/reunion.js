import {Client, CommandInteraction, Message, SlashCommandBuilder, SlashCommandStringOption} from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { changeValueFromFile } from '../Fonctions/changeValueFromFile.js';
import fs from "fs";
import verifierDate from '../Fonctions/DateScript.js';

const description = "Cette commande permet de récuperer/set la prochaine reunion";

const name = "reunion";

const option = new SlashCommandStringOption()
    .setName("date_reunion")
    .setRequired(false)
    .setDescription("Paramètre permettant de définir une nouvelles dates :)")
    
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion paramètre` Ici le 'paramètre' est la date de la nouvelle reunion, le format est de la date est jj/mm/yyyy où jj-mm-yyyy ( exemple : 08/01/2006 ). La commande va donc sauvegarder la prochaine date de reunion."

const run = async (bot, message, args = [null]) =>
{
    try {

        if(bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message))
        {
            console.log(message.author.username, "is running reunion")
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
        console.log("command went wrong while",message.author.username,"was running it\n",error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};


export{description,name,run,option}

async function handleRun(version,args,message)
    
{
    if(!(message instanceof Message || message instanceof CommandInteraction)) return;
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
                console.log("command success, author:",message.author.username)
                await message.reply(`La nouvelle date de reunion a bien été enregistré ! (${ancienneValeur}->${value})`);
            }
    },args,version);
    
    if(option === null) {
        const date = jsonData.prochaineReunion;
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
        console.log("command success, author:",message.author.username)
    }
}