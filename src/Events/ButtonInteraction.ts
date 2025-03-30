import {
    ButtonInteraction,
    Events,
} from "discord.js"

import CBot from "../Class/CBot.js";
import saveEvent from "../Commands/Event/_saveEvent.js";
import saveReunion from "../Commands/Reunion/_saveReunion.js";
import {customId} from "../Enum/customId.js";

const name = Events.InteractionCreate;

const exec = async (bot : CBot, interaction : ButtonInteraction ) =>  {
    if(interaction.isButton())
    {
        if(interaction.customId === customId.event.toString())
        {
            await saveEvent(interaction,bot,2)
        }
        else if(interaction.customId === customId.reunion.toString())
        {
            await saveReunion(interaction,bot,2)
        }
    }
}
export{name,exec}
