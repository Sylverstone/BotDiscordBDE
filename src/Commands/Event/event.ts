import { CommandInteraction, MessageFlags,SlashCommandNumberOption,SlashCommandStringOption } from "discord.js";
import 'dotenv/config'
import __dirname from "../../dirname.js";
import transfromOptionToObject from "../../Fonctions/transfromOptionToObject.js";
import CBot from "../../Class/CBot.js";
import handleError from "../../Fonctions/handleError.js";
import EmptyObject from "../../Fonctions/LookIfObjectIsEmpty.js";
import date from "../../Class/Date/Date.js";
import displayEvent from "./_displayEvent.js";
import saveEvent from "./_saveEvent.js";

export const description = "Cette commande vous renvoie les infos du prochain Event de votre serveur";
export const name = "event";

export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/event` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event 'name' 'datedebut' 'datefin' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'` pour définir un Evènement";

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

export const onlyGuild = true;

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

export interface Evenement_t{
    info_en_plus :string,
    lieu : string,
    datedebut : date | string | Date,
    datefin : date | string | Date,
    heuredebut : number,
    heurefin : number,
    name : string
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
        await message.deferReply({flags : MessageFlags.Ephemeral});
        let optionObject = transfromOptionToObject(message)
        if(EmptyObject(optionObject))
            return displayEvent(message,bot,optionObject);
        else
            return saveEvent(optionObject,message,bot);
    }
    catch(error) {
       if(error instanceof Error)
       {
            handleError(message,error,true);
       }       
    }    
}