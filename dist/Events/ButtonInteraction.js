import { Events, } from "discord.js";
import saveEvent from "../Commands/Event/_saveEvent.js";
import saveReunion from "../Commands/Reunion/_saveReunion.js";
const name = Events.InteractionCreate;
const exec = async (bot, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "+event" /* customId.event */.toString()) {
            await saveEvent(interaction, bot, 2);
        }
        else if (interaction.customId === "+reunion" /* customId.reunion */.toString()) {
            await saveReunion(interaction, bot, 2);
        }
    }
};
export { name, exec };
