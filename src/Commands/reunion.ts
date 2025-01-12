import {CommandInteraction, EmbedBuilder, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, SlashCommandIntegerOption, SlashCommandStringOption} from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { getMostRecentValueFromDB, SaveValueToDB } from '../Fonctions/DbFunctions.js';
import { listCommandObject_t } from '../Fonctions/transfromOptionToObject.js';
import __dirname from '../dirname.js';
import CBot from '../Class/CBot.js';

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

interface reunion_t{
    date : string,
    sujet : string,
    lieu : string,
    more : string,
    heuredebut : number,
    heurefin : number
}

function isReunion(result : unknown) : result is reunion_t
{
    return (
        result !== null && typeof result === "object"
        && "date" in result && "sujet" in result
        && "lieu" in result && "more" in result
        && "heuredebut" in result && "heurefin" in result
    );
}

function isReunionArray(result : unknown) : result is reunion_t[]
{
    return Array.isArray(result) && result.every(row => isReunion(row));
}

export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion paramètre` Ici le 'paramètre' est la date de la nouvelle reunion, le format est de la date est jj/mm/yyyy où jj-mm-yyyy ( exemple : 08/01/2006 ). La commande va donc sauvegarder la prochaine date de reunion.\n PS: si vous utilisez un argument, TOUT les autres sont nécéssaires sauf \`more\`"

const run = async (bot : CBot, message : CommandInteraction) =>
{
    try {
        console.log(message.user, "is running reunion")
        handleRun(message,bot)
    } catch (error) {
        console.log("command went wrong while",message.user.tag,"was running it\n",error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};

export{description,name,run,option,optionInt}

async function handleRun(message : CommandInteraction, bot : CBot)   
{
    console.log(message.user, "is running event")
    let option;
    //pour savoir si l'objet a été init
    let ObjectIsReal = false;
    let optionObject : listCommandObject_t = {};

    option = message.options.data;
    if(option !== null)
    {
        option.forEach(o => {optionObject[o.name] = o.value; ObjectIsReal = true;});
    }
    
    if(!ObjectIsReal) {
        console.log(optionObject)

        await getMostRecentValueFromDB(message,"date, heuredebut, heurefin, lieu, more, sujet","Reunion","idReunion",bot)
        .then(async(result) => {
            
            if(result === null) return message.reply("Il n'y a pas de reunion l'instant.");
            
            if(isReunionArray(result))
            {
                const dateTemp = new Date();
                const dateActu = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate());
                dateActu.setHours(dateTemp.getHours());
                const allfuturReunion = result.filter((row) => {
                    const date = createDate(row.date);
                    return date > dateActu;
                })

                let NearestReunion : reunion_t | null;
                if(allfuturReunion.length > 0)
                {
                    NearestReunion = allfuturReunion[0];
                    
                    allfuturReunion.forEach((row) => {
                        const date = createDate(row.date);
                        if(!(isReunion(NearestReunion))) return;
    
                        if(date < createDate(NearestReunion.date)) NearestReunion = row;
                    });
                }
                else
                {
                    NearestReunion = null
                }
                if(isReunion(NearestReunion))
                {
                    const {date, sujet, heuredebut,heurefin, lieu,more} = NearestReunion;
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
                    
                    return message.reply({embeds : [embedText]})
                }
                else
                {
                    return message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.\n");
                }
            }
            return message.reply("Il n'y a pas de reunion l'instant.");
        });
    }
    else
    {
        //verifier si on peut creer la reunion
        const listeParam = ["date", "sujet", "lieu", "more", "heuredebut","heurefin"];
        let optionObject : listCommandObject_t = {}
        for(const param of listeParam)
        {
            if(message.options.get(param))
            {
                optionObject[param] = message.options.get(param)?.value;
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
            if(!(typeof optionObject.date === "string")) return;
            const dateDebut = createDate(optionObject.date); 
            if(optionObject.heuredebut === undefined || optionObject.heurefin === undefined)
            {
                optionObject.heuredebut = 6;
                optionObject.heurefin = 9;
            }
            if(!(typeof optionObject.heurefin === "number" && typeof optionObject.heuredebut === "number")) return;
            dateDebut.setHours(optionObject.heuredebut)
            const dateFin = createDate(optionObject.date);
            dateFin.setHours(optionObject.heurefin)
            console.log(dateFin)
            console.log(dateDebut)
            if(!message.guild) return;
            if(!(typeof optionObject.lieu === "string" && typeof optionObject.more === "string")) return;
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