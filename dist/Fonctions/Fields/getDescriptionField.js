import { TextInputStyle } from "discord.js";
import { getCustomField } from "./getCustomField.js";
export const getDescriptionField = () => {
    return getCustomField("info_en_plus", "Description", TextInputStyle.Paragraph, false, "Rentrez une belle description de votre évènement :). Le *markdown* est prit en charge");
};
