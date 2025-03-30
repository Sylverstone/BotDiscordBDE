import {ActionRowBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export const getCustomField = (customId : string, label : string, style : TextInputStyle, required : boolean,placeholder = "") =>
{
    const lieuField = new TextInputBuilder({
        customId : customId,
        label : label,
        style : style,
        placeholder : placeholder,
        required : required
    })
    const lieuFieldActionRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(lieuField);
    return lieuFieldActionRow;
}