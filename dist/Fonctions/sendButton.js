import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
export const sendButton = async (result, customId) => {
    const but = new ButtonBuilder()
        .setLabel("Click pour continuer !")
        .setCustomId(customId.toString())
        .setStyle(ButtonStyle.Success);
    const ar = new ActionRowBuilder().addComponents(but);
    await result.reply({ content: "", components: [ar] });
};
