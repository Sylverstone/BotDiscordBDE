import { getValueFromDB } from "../../Fonctions/DbFunctions.js";
import { isReunion, isReunionArray, reunion_t } from "./reunion.js";
import filterFuturEvent from "../../Fonctions/filterFuturEvent.js";
import makeEmbedABoutEvent from "../../Fonctions/makeEmbedAboutEvent.js";
import { EVentType } from "../../Enum/EventType.js";
import make_log from "../../Fonctions/makeLog.js";
import { CommandInteraction } from "discord.js";
import CBot from "../../Class/CBot.js";

export default async function displayReunion(message : CommandInteraction, bot : CBot, )
{
    await getValueFromDB(message,"date, heuredebut, heurefin, lieu, info_en_plus, sujet,reunion_name","Reunion","idReunion",bot)
    .then(async(result) => {            
        if(result === null) return message.editReply("Il n'y a pas de reunion l'instant.");
        if(isReunionArray(result))
        {
            const allfuturReunion = filterFuturEvent(result);
            if(!(isReunionArray(allfuturReunion))) return;
            let NearestReunion : reunion_t | null;
            if(allfuturReunion.length > 0)
            {
                NearestReunion = allfuturReunion[0];
                
                allfuturReunion.forEach((row) => {
                    const date = row.date;
                    if(!(date instanceof Date)) return;
                    if(!(isReunion(NearestReunion))) return;
                    const temp_date = NearestReunion.date;
                    if(!(temp_date instanceof Date)) return;
                    if(date < temp_date) NearestReunion = row;
                });
            }
            else
            {
                NearestReunion = null
            }
            if(isReunion(NearestReunion))
            {
                const {date, sujet, heuredebut,heurefin, lieu,info_en_plus} = NearestReunion;
                if(!(date instanceof Date)) return;
                const embedText = makeEmbedABoutEvent(bot,EVentType.Reunion,sujet,[date,],[heuredebut,heurefin],
                    lieu,info_en_plus
                )
                make_log(true,message);
                
                return message.editReply({embeds : [embedText]})
            }
            else
            {
                make_log(true,message);
                return message.editReply("Il n'y a pas de prochaine reunion prévu pour l'instant.\n");
            }
        }
        return message.editReply("Il n'y a pas de reunion l'instant.");
    });
}