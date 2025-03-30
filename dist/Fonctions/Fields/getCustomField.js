import { ActionRowBuilder, TextInputBuilder } from "discord.js";
export const getCustomField = (customId, label, style, required, placeholder = "") => {
    const lieuField = new TextInputBuilder({
        customId: customId,
        label: label,
        style: style,
        placeholder: placeholder,
        required: required
    });
    const lieuFieldActionRow = new ActionRowBuilder().addComponents(lieuField);
    return lieuFieldActionRow;
};
