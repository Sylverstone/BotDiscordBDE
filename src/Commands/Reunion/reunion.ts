import {CommandInteraction, MessageFlags, SlashCommandNumberOption, SlashCommandStringOption} from 'discord.js';
import transfromOptionToObject from '../../Fonctions/transfromOptionToObject.js';
import __dirname from '../../dirname.js';
import CBot from '../../Class/CBot.js';
import handleError from '../../Fonctions/handleError.js';
import EmptyObject from '../../Fonctions/LookIfObjectIsEmpty.js';
import displayReunion from './_displayReunion.js';
import saveReunion from './_saveReunion.js';
import make_log from '../../Fonctions/makeLog.js';
import date from '../../Class/Date/Date.js';

const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";

const name = "reunion";
const onlyGuild = true;

export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion 'date' 'sujet' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'`. Une deuxième réunion sera alors sauvegarder";

const option = [
    new SlashCommandStringOption()
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
    .setName("info_en_plus")
    .setRequired(false)
    .setDescription("Indiquez des infos supplémentaire si vous le souhaite")
];
    

const optionNum = [
    new SlashCommandNumberOption()
    .setName("heuredebut")
    .setRequired(false)
    .setDescription("Indiquez l'heure de début de la réunion"),
    new SlashCommandNumberOption()
    .setName("heurefin")
    .setRequired(false)
    .setDescription("Indiquez l'heure de fin de la réunion")
];


export interface reunion_t{
    date : Date | string | date,
    sujet : string,
    lieu : string,
    info_en_plus : string,
    heuredebut : number,
    heurefin : number,
    reunion_name : string,
}

interface maxId_t
{
    maxId : number
}

export function isMaxId(result : unknown) : result is maxId_t
{
    return (
        result !== null && typeof result === "object"
        && "maxId" in result && typeof result.maxId === "number"
    );
}
export function isReunion(result : unknown) : result is reunion_t
{
    
    return (
        result !== null && typeof result === "object"
        && "date" in result && "sujet" in result
        && "lieu" in result && "info_en_plus" in result
        && "heuredebut" in result && "heurefin" in result
    );
}


export function isReunionArray(result : unknown) : result is reunion_t[]
{
    return Array.isArray(result) && result.every(row => isReunion(row));
}


const run = async (bot : CBot, message : CommandInteraction) =>
{
    await message.deferReply({flags : MessageFlags.Ephemeral});
    try {
        let optionObject = transfromOptionToObject(message);
        if(EmptyObject(optionObject)) 
            displayReunion(message,bot)        
        else        
            saveReunion(message,bot,optionObject);
        return make_log(true,message);
        
    } 
    catch (error) {
        if(error instanceof Error) {
            handleError(message,error,true);
        }        
    }
    
};

export{description,name,run,option,optionNum,onlyGuild}

