import {
    CommandInteraction,
    MessageFlags,
    SlashCommandBooleanOption,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js';
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

export const optionBoolean =
[
    new SlashCommandBooleanOption()
        .setName("creer_reunion")
        .setDescription("True si vous voulez creer une réunion, False sinon.")
        .setRequired(true)
]

export interface reunion_t{
    date : Date | string | date,
    sujet : string,
    lieu : string,
    info_en_plus : string,
    heuredebut : number,
    heurefin : number,
    reunion_name : string,
}

interface optionData_t
{
    creer_reunion : boolean;
}

const isOptionData_t = (elt : unknown) : elt is optionData_t =>
{
    return elt !== null && typeof elt === "object" && "creer_reunion" in elt;
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

    try {
        let optionObject = transfromOptionToObject(message);
        if(!isOptionData_t(optionObject)) return;
        const {creer_reunion} = optionObject;

        if(!creer_reunion)
            await displayReunion(message,bot)
        else        
            await saveReunion(message,bot);
        return make_log(true,message);
        
    } 
    catch (error) {
        console.log(error);
        if(error instanceof Error) {
            handleError(message,error,true);
        }        
    }
    
};

export{description,name,run,onlyGuild}

