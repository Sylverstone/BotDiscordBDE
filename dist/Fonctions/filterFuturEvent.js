import { isReunion } from "../Commands/reunion.js";
export default function filterFuturEvent(result) {
    const dateActu = new Date();
    const n = result.filter(row => {
        const date = isReunion(row) ? row.date : row.datedebut;
        if (!(date instanceof Date))
            return;
        return date.getTime() > dateActu.getTime();
    });
    return n;
}
