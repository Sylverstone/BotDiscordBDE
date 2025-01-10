import {Client, CommandInteraction, EmbedBuilder, Message, SlashCommandBuilder, SlashCommandStringOption} from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { changeSpecialValueFromFIle, getMostRecentValueFromDB, SaveValueToDB } from '../Fonctions/DbFunctions.js';
import fs from "fs";
import path from 'path';
import verifierDate from '../Fonctions/DateScript.js';
import __dirname from '../dirname.js';
import { table } from 'console';

const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";

const name = "reunion";

const option = [new SlashCommandStringOption()
    .setName("date")
    .setRequired(false)
    .setDescription("Paramètre permettant de définir une nouvelles dates :)"),
    new SlashCommandStringOption()
    .setName("sujet")
    .setRequired(false)
    .setDescription("indiquez le lieu de sujet de la reunion"),
    new SlashCommandStringOption()
    .setName("heure")
    .setRequired(false)
    .setDescription("Indiquez l'heure de la réunion"),
    new SlashCommandStringOption()
    .setName("lieu")
    .setRequired(false)
    .setDescription("Indiquez le lieu de la réunion"),
    new SlashCommandStringOption()
    .setName("more")
    .setRequired(false)
    .setDescription("Indiquez des infos supplémentaire si vous le souhaite")
]
    
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion paramètre` Ici le 'paramètre' est la date de la nouvelle reunion, le format est de la date est jj/mm/yyyy où jj-mm-yyyy ( exemple : 08/01/2006 ). La commande va donc sauvegarder la prochaine date de reunion."

const run = async (bot, message) =>
{
    try {

        if(bot instanceof Client && (message instanceof CommandInteraction))
        {
            console.log(message.user, "is running reunion")
            handleRun(message,bot)
        }
        
    } catch (error) {
        console.log("command went wrong while",message.user,"was running it\n",error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};


export{description,name,run,option}

async function handleRun(message,bot)
    
{
    if(!(message instanceof CommandInteraction)) return;
    console.log(message.user, "is running event")
    let option;
    //pour savoir si l'objet a été init
    let ObjectIsReal = false;
    let optionObject = {};

    option = message.options.data;
    if(option !== null)
    {
        option.forEach(o => {optionObject[o.name] = o.value; ObjectIsReal = true;});
    }
    
    if(!ObjectIsReal) {
        console.log(optionObject)

        await getMostRecentValueFromDB(message,"date, heure, lieu, more, sujet","Reunion","idReunion",bot)
        .then(async(result) => {
            
            if(!(result === null))
            {
                const {date, sujet, heure, lieu,more} = result;
              
                const [jour, mois, annee] = date.split("/");
                const datefr = jour+"/"+mois+"/"+annee;
                const prochaineReunion = new Date(`${annee}-${mois}-${jour}`);
                const dateTemp = new Date();
                const dateActu = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate());
                const infoEnPlusText = more === "" ? "" : "Info en plus : " + more;
                const embedText = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle(`Prochaine réunion - ${sujet}`)
                    .setDescription(`date : ${date}\n
                                    heure : ${heure}\n
                                    lieu : ${lieu}\n
                                    ${infoEnPlusText}`)
                    .setFooter({
                        text: "Au plaisir de vous aidez",
                        iconURL: bot.user?.displayAvatarURL() || ""
                    })
                if(prochaineReunion >= dateActu)
                {
                    return message.reply({embeds : [embedText]})
                }
                else
                {
                    return message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.\nLa dernière date du " + datefr);
                }
                
                
            }
            return message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.");
            
        });
        
        
        
    }
    else
    {
        const finalObjectEvent = {
            date : optionObject.date|| "Aucune date n'a été transmise",
            sujet : optionObject.sujet || "Aucun sujet n'a été transmis",
            lieu : optionObject.lieu || "Aucun lieu n'a été transmis",
            more : optionObject.more || "Aucune info en plus n'a été fournit",
            heure : optionObject.heure || "Aucune heure n'a été fournit"
        }

        SaveValueToDB(message,bot,"Reunion",finalObjectEvent)
        .then(result => {
            console.log("command succes -author:",message.user);
            return message.reply({content : `Le changement a bien été fait ! :)`})
        })
        .catch(err => {throw err});

    }
}