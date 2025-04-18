import { CommandInteraction } from "discord.js";
import EmptyObject from "../../Fonctions/LookIfObjectIsEmpty.js";
import { getValueFromDB } from "../../Fonctions/DbFunctions.js";
import { isEvent, isEventArray } from "./event.js";
import filterFuturEvent from "../../Fonctions/filterFuturEvent.js";
import makeEmbedABoutEvent from "../../Fonctions/makeEmbedAboutEvent.js";
import { EVentType } from "../../Enum/EventType.js";
import CBot from "../../Class/CBot.js";
import { listCommandObject_t } from "../../Fonctions/transfromOptionToObject.js";
import { Evenement_t } from "./event.js";

export default async function displayEvent(message : CommandInteraction, bot : CBot)
{
        await message.deferReply();
        const objectEvent = await getValueFromDB(message,"lieu, info_en_plus, datedebut,datefin, name, heuredebut, heurefin","Event","id",bot);
        if(objectEvent === null) return message.editReply("Il n'y a pas d'Event planifié pour les prochains jours");

        if(!isEventArray(objectEvent)) return;
        const allFuturEvent = filterFuturEvent(objectEvent);
        if(!(isEventArray(allFuturEvent))) return;
        let NearestEvent : Evenement_t | null;
        if(allFuturEvent.length > 0)
        {
            NearestEvent = allFuturEvent[0];
            
            allFuturEvent.forEach((row) => {
                const ndate = row.datedebut;
                if(!(ndate instanceof Date)) return;
                if(!(isEvent(NearestEvent))) return;
                const temp_date = NearestEvent.datedebut;
                if(!(temp_date instanceof Date)) return;
                if(ndate < temp_date) NearestEvent = row;
            });
        }
        else
        {
            NearestEvent = null
        }
        if(isEvent(NearestEvent))
        {
            if(!(NearestEvent.datedebut instanceof Date && NearestEvent.datefin instanceof Date)) return;
            if(!(typeof NearestEvent.name === "string" && typeof NearestEvent.heuredebut === "number" && typeof NearestEvent.heurefin === "number"
            && typeof NearestEvent.lieu === "string" && typeof NearestEvent.info_en_plus === "string")) return;
            const embedText = makeEmbedABoutEvent(bot,EVentType.Event,NearestEvent.name,
                [NearestEvent.datedebut,NearestEvent.datefin],[NearestEvent.heuredebut,NearestEvent.heurefin],
                NearestEvent.lieu,
                NearestEvent.info_en_plus
            );
            return message.editReply({embeds : [embedText]})
        }
        return message.editReply("Il n'y a pas d'Event planifié pour les prochains jours");

}