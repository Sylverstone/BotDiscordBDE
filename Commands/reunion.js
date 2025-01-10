import {Client, CommandInteraction, EmbedBuilder, Entitlement, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, Message, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, StageInstancePrivacyLevel} from 'discord.js';
import { createDate, dateToOnlyDate } from '../Fonctions/DateScript.js';
import { getMostRecentValueFromDB, SaveValueToDB } from '../Fonctions/DbFunctions.js';

import __dirname from '../dirname.js';
import { lutimes } from 'fs';
import transfromOptionToObject from '../Fonctions/transfromOptionToObject.js';

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
    .setName("lieu")
    .setRequired(false)
    .setDescription("Indiquez le lieu de la réunion"),
    new SlashCommandStringOption()
    .setName("more")
    .setRequired(false)
    .setDescription("Indiquez des infos supplémentaire si vous le souhaite")
]
    
const optionInt = [
    new SlashCommandIntegerOption()
    .setName("heuredebut")
    .setRequired(false)
    .setDescription("Indiquez l'heure de début de la réunion"),
    new SlashCommandIntegerOption()
    .setName("heurefin")
    .setRequired(false)
    .setDescription("Indiquez l'heure de fin de la réunion")]

export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion paramètre` Ici le 'paramètre' est la date de la nouvelle reunion, le format est de la date est jj/mm/yyyy où jj-mm-yyyy ( exemple : 08/01/2006 ). La commande va donc sauvegarder la prochaine date de reunion.\n PS: si vous utilisez un argument, TOUT les autres sont nécéssaires sauf \`more\`"

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


export{description,name,run,option,optionInt}

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

        await getMostRecentValueFromDB(message,"date, heuredebut, heurefin, lieu, more, sujet","Reunion","idReunion",bot)
        .then(async(result) => {
            
            if(!(result === null))
            {
                const {date, sujet, heuredebut,heurefin, lieu,more} = result;
              
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
                                    heure : ${heuredebut} -> ${heurefin}\n
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
        //verifier si on peut creer la reunion
        const listeParam = ["date", "sujet", "lieu", "more", "heuredebut","heurefin"];
        let optionObject = {}
        for(const param of listeParam)
        {
            if(message.options.get(param))
                {
                    optionObject[param] = message.options.get(param).value;
                }
                else if(param !== "more")
                {
                    return message.reply("Votre reunion ne peut pas être initialisé, il manque des infos importantes")
                }
        }
          
        const finalObjectEvent = {
            date : optionObject.date,
            sujet : optionObject.sujet ,
            lieu : optionObject.lieu ,
            more : optionObject.more || "Aucune info en plus n'a été fournit",
            heuredebut : optionObject.heuredebut,
            heurefin : optionObject.heurefin 
        }

        SaveValueToDB(message,bot,"Reunion",finalObjectEvent)
        .then(async result => {
            console.log("command succes -author:",message.user);
            console.log(message.options.data)
            const dateDebut = createDate(optionObject.date);
            if(optionObject.heuredebut === undefined || optionObject.heurefin === undefined)
            {
                optionObject.heuredebut = 6;
                optionObject.heurefin = 9;
            }
            
            dateDebut.setHours(optionObject.heuredebut)
            const dateFin = createDate(optionObject.date);
            dateFin.setHours(optionObject.heurefin)
            console.log(dateFin)
            console.log(dateDebut)
            const event = await message.guild.scheduledEvents.create({
                name : `Reunion -> ${optionObject.sujet}`,
                scheduledStartTime : dateDebut,
                scheduledEndTime : dateFin,
                privacyLevel :GuildScheduledEventPrivacyLevel.GuildOnly,
                entityType : GuildScheduledEventEntityType.External,
                entityMetadata : {
                    location : optionObject.lieu
                },
                description : optionObject.more
            });
            return message.reply({content : `La réunion à été crée !`})
        })
        .catch(err => {throw err});

    }
}