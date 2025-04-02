import {
    CommandInteraction,
    SlashCommandBooleanOption, SlashCommandStringOption,
} from "discord.js";
import 'dotenv/config'
import transfromOptionToObject from "../../Fonctions/transfromOptionToObject.js";
import CBot from "../../Class/CBot.js";
import handleError from "../../Fonctions/handleError.js";
import date from "../../Class/Date/Date.js";
import displayEvent from "./_displayEvent.js";
import saveEvent from "./_saveEvent.js";
import make_log from "../../Fonctions/makeLog.js";

export const description = "Cette commande vous renvoie les infos du prochain Event de votre serveur";
export const name = "event";

export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/event` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event 'name' 'datedebut' 'datefin' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'` pour définir un Evènement";

/*
export const option = [
    new SlashCommandStringOption()
    .setName("name")
    .setDescription("le nom de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("datedebut")
    .setDescription("la date de début de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("datefin")
    .setDescription("la date de fin l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("lieu")
    .setDescription("le lieu de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("info_en_plus")
    .setDescription("Lien pour en savoir plus")
    .setRequired(false),
    
];
*/


export const option =
    [
        new SlashCommandStringOption()
            .setName("creer-evenement")
            .setDescription("Oui si vous voulez en creer un. Rien sinon")
            .setRequired(false)
            .addChoices({name : "Oui", value : "Oui"})
    ]

export const onlyGuild = true;

/*
export const optionNum = [
    new SlashCommandNumberOption()
    .setName("heuredebut")
    .setDescription("heure de début l'évènements")
    .setRequired(false),
    new SlashCommandNumberOption()
    .setName("heurefin")
    .setDescription("heure de fin l'évènements")
    .setRequired(false)
];
*/


export interface Evenement_t{
    info_en_plus :string,
    lieu : string,
    datedebut  : date | string | Date,
    datefin  : date | string | Date,
    heuredebut  : number,
    heurefin  : number,
    name  : string
}

export function isEvent(object : unknown) : object is Evenement_t{
    return (
        typeof object === 'object' &&
        object !== null &&
        'lieu' in object &&
        'info_en_plus' in object &&
        'datedebut' in object &&
        'datefin' in object &&
        'name' in object &&
        'heuredebut' in object &&
        'heurefin' in object 
    );
}

export function isEventArray(value: unknown): value is Evenement_t[] {
    return Array.isArray(value) && value.every(item => isEvent(item));
}


export const  run = async(bot : CBot, message : CommandInteraction) => {
    
    try {
        const length = message.options.data.length;
        if( length <= 0 )
            await displayEvent(message,bot);
        else
        {
            await saveEvent(message,bot);
        }
            //await saveEvent(optionObject,message,bot);
        return make_log(true,message);
        
    }
    catch(error) {
       if(error instanceof Error)
       {
            handleError(message,error,true);
       }       
    }    
}