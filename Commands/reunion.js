import {Client, CommandInteraction, EmbedBuilder, Message, SlashCommandBuilder, SlashCommandStringOption} from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { changeSpecialValueFromFIle, changeValueFromFile } from '../Fonctions/changeValueFromFile.js';
import fs from "fs";
import path from 'path';
import verifierDate from '../Fonctions/DateScript.js';
import __dirname from '../dirname.js';

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

const run = async (bot, message, args = [null]) =>
{
    try {

        if(bot instanceof Client && (message instanceof CommandInteraction || message instanceof Message))
        {
            console.log(message.user, "is running reunion")
            let version = 0;
            if(message instanceof Message)
            {
                version = 1
            }
            if(args.length === 0)
            {
                args = [null];
            }
            handleRun(version, args,message,bot)
            
        }
        
    } catch (error) {
        console.log("command went wrong while",message.user,"was running it\n",error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};


export{description,name,run,option}

async function handleRun(version,args,message,bot)
    
{
    if(!(message instanceof Message || message instanceof CommandInteraction)) return;
    console.log(message.user, "is running event")
    let option;
    //pour savoir si l'objet a été init
    let ObjectIsReal = false;
    let optionObject = {};
    const ListeParam = ["date","sujet","heure","lieu","more"]
    if(message instanceof CommandInteraction)
    {
        option = message.options.data;
        if(option !== null)
        {
            option.forEach(o => {optionObject[o.name] = o.value; ObjectIsReal = true;});
        }
    }
    else
    {
        args.forEach((value,index) => {optionObject[ListeParam[index]] = value; ObjectIsReal = true});
    }

    if(!ObjectIsReal) {
        console.log(optionObject)
        const jsonFile = path.join(__dirname,"JSON","data.json");
        const jsonData = JSON.parse(fs.readFileSync(jsonFile));
        const {date, sujet, heure, lieu,more} = jsonData.prochaineReunion;
        const [jour, mois, annee] = date.split("/");
        const datefr = jour+"/"+mois+"/"+annee;
        const prochaineReunion = new Date(`${annee}-${mois}-${jour}`);
        const dateActu = new Date();
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
        if(prochaineReunion > dateActu)
        {
            await message.reply({embeds : [embedText]})
        }
        else
        {
            await message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.\nLa dernière date du " + datefr);
        }
    }
    else
    {
        const finalObjectEvent = {
            date : optionObject.date|| "pas de date",
            sujet : optionObject.sujet || "pas de sujet",
            lieu : optionObject.lieu || "pas de lieu",
            more : optionObject.more || "pas d'information en plus",
            heure : optionObject.heure || "pas d'heure définit"
        }

        changeSpecialValueFromFIle("prochaineReunion", finalObjectEvent)
        console.log("command succes -author:",message.user);
        return message.reply({content : `Le changement a bien été fait ! :)`})
    }
}