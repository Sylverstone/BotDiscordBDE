import { Evenement_t } from "../Commands/Event/event.js";
import { isReunion, reunion_t } from "../Commands/reunion.js";
import splitNumber from "./splitHeure.js";

export default function filterFuturEvent(result : reunion_t[] | Evenement_t[])
{
    const dateActu = new Date();
    const n = result.filter(row => 
    {   
        const date = isReunion(row) ? row.date : row.datedebut;
        if(!(date instanceof Date)) return;
        return date.getTime() > dateActu.getTime();
    })

    return n;
}

