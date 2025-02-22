import { CommandInteraction, EmbedBuilder,hyperlink, SlashCommandIntegerOption,SlashCommandNumberOption,SlashCommandStringOption } from "discord.js";
import { createDate, setup_date, to_date_sql } from "../Fonctions/DateScript.js";
import { SaveValueToDB,  getLastId,  getValueFromDB } from "../Fonctions/DbFunctions.js";
import 'dotenv/config'
import __dirname from "../dirname.js";
import transfromOptionToObject from "../Fonctions/transfromOptionToObject.js";
import CBot from "../Class/CBot.js";
import CreateEvent from "../Fonctions/CreateEvent.js";
import handleError from "../Fonctions/handleError.js";
import splitNumber from "../Fonctions/splitHeure.js";
import make_log from "../Fonctions/makeLog.js";
import { isMaxId } from "./reunion.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import EmptyObject from "../Fonctions/LookIfObjectIsEmpty.js";

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

interface Evenement_t{
    info_en_plus :string,
    lieu : string,
    datedebut : Date | string,
    datefin : Date | string,
    heuredebut : number,
    heurefin : number,
    name : string
}

function isEvent(object : unknown) : object is Evenement_t{
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

function isEventArray(value: unknown): value is Evenement_t[] {
    return Array.isArray(value) && value.every(item => isEvent(item));
}

const getDataEvent = (Ev : Evenement_t) => {
    const [integerPart,DecimalPart] = splitNumber(Ev.heuredebut);
    const [integerPartFin,DecimalPartFin] = splitNumber(Ev.heurefin);
    const textInfoPlus = Ev.info_en_plus ===  "Aucune info en plus n'a été fournit" ? Ev.info_en_plus +"." : `${hyperlink("Ici",Ev.info_en_plus)} vous pourrez retrouvez plus d'information :)`
    return `Le prochaine évènements est : \`${Ev.name}\` et il aura lieu le \`${Ev.datedebut}\` jusqu'au \`${Ev.datefin}\` à \`'${Ev.lieu}'\` de \`${integerPart}h${DecimalPart} à ${integerPartFin}h${DecimalPartFin}\`.\n\n${textInfoPlus}`    
}

export const  run = async(bot : CBot, message : CommandInteraction) => {
    try {
        let optionObject = transfromOptionToObject(message)
        if(EmptyObject(optionObject))
        {            
            const objectEvent = await getValueFromDB(message,"lieu, info_en_plus, datedebut,datefin, name, heuredebut, heurefin","Event","id",bot);
            console.log(objectEvent)
            if(objectEvent === null) return message.reply("Il n'y a pas d'Event planifié pour les prochains jours");

            if(!isEventArray(objectEvent)) return;
            const DateAujourdhui = new Date();
            const allFuturEvent = objectEvent.filter((row) => {
                const date = row.datedebut;
                if(!(date instanceof Date)) return;
                return date > DateAujourdhui;
            })

            let NearestEvent : Evenement_t | null;
            if(allFuturEvent.length > 0)
            {
                NearestEvent = allFuturEvent[0];
                
                allFuturEvent.forEach((row) => {
                    const date = row.datedebut;
                    if(!(date instanceof Date)) return;
                    if(!(isEvent(NearestEvent))) return;
                    const temp_date = NearestEvent.datedebut;
                    if(!(temp_date instanceof Date)) return;
                    if(date < temp_date) NearestEvent = row;
                });
            }
            else
            {
                NearestEvent = null
            }
            if(isEvent(NearestEvent))
            {
                const textEnv = getDataEvent(NearestEvent)
                const embedText = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(NearestEvent.name)
                    .setFooter({
                        text: "Au plaisr de vous aidez",
                        iconURL: bot.user?.displayAvatarURL() || ""
                    })
                    .setDescription(textEnv)
                make_log(true,message);
                return message.reply({embeds : [embedText]})
            }
            make_log(true,message);
            return message.reply("Il n'y a pas d'Event planifié pour les prochains jours");
            
        }
        else
        {
            if(!("info_en_plus" in optionObject))
            {
                optionObject["info_en_plus"] = "Aucune info en plus n'a été fournit"
            }
            if(!isEvent(optionObject)) return message.reply("La définition de l'Evenement n'est pas complète");
            const optionEvent : Evenement_t = optionObject;
            const dateActu = new Date();
            if(optionEvent.datedebut instanceof Date || optionEvent.datefin instanceof Date) return ;
            const DateResult : null | Date[] = setup_date(optionEvent.datedebut, optionEvent.datefin,optionEvent.heuredebut,optionEvent.heurefin,
                message);
            if(DateResult === null) return ;

            const dateDebutEvent = DateResult[0];
            const dateFinEvent = DateResult[1];
            console.log("date debut  :",dateDebutEvent.getHours(),"\n",dateFinEvent.getHours())
            if(dateActu.getTime() > dateDebutEvent.getTime()) return message.reply("L'evenement ne peut pas être défini dans le passé");
            //on change le separateur pour date to sql, si la date n'était pas bonnes le programme se serait arreter.
            optionEvent.datedebut = optionEvent.datedebut.replace("/","-").replace("/","-");
            optionEvent.datefin = optionEvent.datefin.replace("/","-").replace("/","-");
            
            const finalObjectEvent = {
                name : optionEvent.name,
                datedebut :to_date_sql(optionEvent.datedebut),
                datefin : to_date_sql(optionEvent.datefin),
                heuredebut : optionEvent.heuredebut,
                heurefin : optionEvent.heurefin,
                lieu : optionEvent.lieu,
                info_en_plus : optionEvent.info_en_plus,
            }
            
            await message.reply("Prépatation de l'évènement...")
            SaveValueToDB(message,bot,"Event",finalObjectEvent)
            .then(async result => {
                const name = optionEvent.name;
                const lieu = optionEvent.lieu;
                const info_en_plus = optionEvent.info_en_plus;
                console.log("date :",dateDebutEvent,dateFinEvent)
                const res  = await getLastId("Event","id",bot);
                if(!isMaxId(res)) return;                
                const id = res.maxId;
                const typeEvent = "Evènement";
                //on envoie le mess dans ça
                CreateEvent(message,name,dateDebutEvent,dateFinEvent,lieu,info_en_plus,typeEvent,id)
                .then( name => {

                    displayEmbedsMessage(message, new EmbedBuilder()
                                                        .setTitle("Evènement")
                                                        .setDescription("L'Evènement a été crée. il se nomme : " + name),true);

                    make_log(true,message);

                }).catch(err => {
                    displayEmbedsMessage(message, new EmbedBuilder()
                        .setTitle("Erreur")
                        .setDescription("Une erreur a eu lieu"),true);

                    make_log(false,message);
                })
                
                
            })
            .catch(err => {
                handleError(message,err);
            });
            
        }
    }catch(error) {
       if(error instanceof Error)
       {
            handleError(message,error);
       }
       
    }

    
}