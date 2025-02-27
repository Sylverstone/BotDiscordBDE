import { CommandInteraction, EmbedBuilder } from "discord.js";
import { listCommandObject_t } from "../../Fonctions/transfromOptionToObject.js";
import { Evenement_t, isEvent } from "./event.js";
import date from "../../Class/Date/Date.js";
import { setup_date } from "../../Fonctions/DateScript.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import { getLastId, SaveValueToDB } from "../../Fonctions/DbFunctions.js";
import CBot from "../../Class/CBot.js";
import { isMaxId } from "../Reunion/reunion.js";
import CreateEvent from "../../Fonctions/CreateEvent.js";

export default async function saveEvent(optionObject :listCommandObject_t, message : CommandInteraction, bot : CBot)
{
        if(!("info_en_plus" in optionObject))
        {
            optionObject["info_en_plus"] = "Aucune info en plus n'a été fournit"
        }
        if(!isEvent(optionObject)) return message.editReply("La définition de l'Evenement n'est pas complète");
        const optionEvent : Evenement_t = optionObject;
        const dateActu = new date();
        if(!(typeof optionEvent.datedebut === "string" && typeof optionEvent.datefin === "string")) return ;
        const DateResult : null | date[] = setup_date(optionEvent.datedebut, optionEvent.datefin,optionEvent.heuredebut,optionEvent.heurefin,
            message);
        if(DateResult === null) return ;

        const dateDebutEvent = DateResult[0];
        const dateFinEvent = DateResult[1];
        if(dateActu.getTime() > dateDebutEvent.getTime()) return message.reply("L'evenement ne peut pas être défini dans le passé");
        //on change le separateur pour date to sql, si la date n'était pas bonnes le programme se serait arreter.
        optionEvent.datedebut = optionEvent.datedebut.replace("/","-").replace("/","-");
        optionEvent.datefin = optionEvent.datefin.replace("/","-").replace("/","-");
        
        const finalObjectEvent = {
            name : optionEvent.name,
            datedebut : dateDebutEvent.toString(),
            datefin : dateFinEvent.toString(),
            heuredebut : optionEvent.heuredebut,
            heurefin : optionEvent.heurefin,
            lieu : optionEvent.lieu,
            info_en_plus : optionEvent.info_en_plus,
        }

        const EventList = await message.guild?.scheduledEvents.fetch();
        if(typeof EventList?.find(event => event.name === optionEvent.name) !== "undefined") 
        {
            displayEmbedsMessage(message,new EmbedBuilder()
                                                .setTitle("Erreur")
                                                .setDescription("Un évènement avec le même nom existe déjà"),true);
            return;
        }
        SaveValueToDB(message,bot,"Event",finalObjectEvent)
        .then(async result => {
            const name = optionEvent.name;
            const lieu = optionEvent.lieu;
            const info_en_plus = optionEvent.info_en_plus;
            const res  = await getLastId("Event","id",bot);
            if(!isMaxId(res)) throw new Error("res n'est pas la valeur attendu");                
            const id = res.maxId;
            //on envoie le mess dans ça
            CreateEvent(message,name,dateDebutEvent,dateFinEvent,lieu,info_en_plus,id,optionEvent.name)
            .then( name => {
                displayEmbedsMessage(message, new EmbedBuilder()
                                                    .setTitle("Evènement")
                                                    .setDescription("L'Evènement a été crée. il se nomme : " + name),true);
            }).catch(err => {                    
                throw err;
            })
        })
        .catch(err => {
            throw err;
        });            
}