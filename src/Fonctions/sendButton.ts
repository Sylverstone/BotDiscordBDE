import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalSubmitInteraction} from "discord.js";
import {customId} from "../Enum/customId.js";

export const sendButton = async (result : ModalSubmitInteraction,customId : customId) =>
{
    const but = new ButtonBuilder()
        .setLabel("Click pour continuer !")
        .setCustomId(customId.toString())
        .setStyle(ButtonStyle.Success)
    const ar: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(but);
    await result.reply({content: "", components: [ar]});
}