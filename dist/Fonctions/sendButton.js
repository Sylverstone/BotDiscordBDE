import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import saveEvent from "../Commands/Event/_saveEvent.js";
import saveReunion from "../Commands/Reunion/_saveReunion.js";
export const sendButton = async (label, result, _customId, bot) => {
    const but = new ButtonBuilder()
        .setLabel(label)
        .setCustomId(_customId.toString())
        .setStyle(ButtonStyle.Success);
    const ar = new ActionRowBuilder().addComponents(but);
    const reply = await result.reply({ content: "", components: [ar] });
    const collector = reply.createMessageComponentCollector({
        time: 30000,
        componentType: ComponentType.Button
    });
    collector.on("collect", async (collected) => {
        if (collected.customId === _customId.toString() && collected.user.id === result.user.id) {
            if (_customId === "+reunion" /* customId.reunion */) {
                await saveReunion(collected, bot, 2);
            }
            else {
                await saveEvent(collected, bot, 2);
            }
        }
    });
    collector.on("end", async (collected) => {
        but.setDisabled(true);
        but.setLabel("Out of time");
        reply.edit({
            components: [ar],
        });
    });
};
