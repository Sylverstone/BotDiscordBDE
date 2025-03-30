import { TextInputStyle } from "discord.js";
import { getCustomField } from "./getCustomField.js";
export const getDescriptionField = () => {
    return getCustomField("info_en_plus", "Description", TextInputStyle.Short, false, "Rentrez une belle description de votre évènement :). Le *markdown* est prit en charge");
};
