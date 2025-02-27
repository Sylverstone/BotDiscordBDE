import EmptyObject from "../../Fonctions/LookIfObjectIsEmpty.js";
import { getValueFromDB } from "../../Fonctions/DbFunctions.js";
import { isEvent, isEventArray } from "./event.js";
import filterFuturEvent from "../../Fonctions/filterFuturEvent.js";
import makeEmbedABoutEvent from "../../Fonctions/makeEmbedAboutEvent.js";
import { EVentType } from "../../Enum/EventType.js";
import make_log from "../../Fonctions/makeLog.js";
export default async function displayEvent(message, bot, optionObject) {
    if (EmptyObject(optionObject)) {
        const objectEvent = await getValueFromDB(message, "lieu, info_en_plus, datedebut,datefin, name, heuredebut, heurefin", "Event", "id", bot);
        if (objectEvent === null)
            return message.editReply("Il n'y a pas d'Event planifié pour les prochains jours");
        if (!isEventArray(objectEvent))
            return;
        const allFuturEvent = filterFuturEvent(objectEvent);
        if (!(isEventArray(allFuturEvent)))
            return;
        let NearestEvent;
        if (allFuturEvent.length > 0) {
            NearestEvent = allFuturEvent[0];
            allFuturEvent.forEach((row) => {
                const ndate = row.datedebut;
                if (!(ndate instanceof Date))
                    return;
                if (!(isEvent(NearestEvent)))
                    return;
                const temp_date = NearestEvent.datedebut;
                if (!(temp_date instanceof Date))
                    return;
                if (ndate < temp_date)
                    NearestEvent = row;
            });
        }
        else {
            NearestEvent = null;
        }
        if (isEvent(NearestEvent)) {
            if (!(NearestEvent.datedebut instanceof Date && NearestEvent.datefin instanceof Date))
                return;
            const embedText = makeEmbedABoutEvent(bot, EVentType.Event, NearestEvent.name, [NearestEvent.datedebut, NearestEvent.datefin], [NearestEvent.heuredebut, NearestEvent.heurefin], NearestEvent.lieu, NearestEvent.info_en_plus);
            make_log(true, message);
            return message.editReply({ embeds: [embedText] });
        }
        make_log(true, message);
        return message.editReply("Il n'y a pas d'Event planifié pour les prochains jours");
    }
}
