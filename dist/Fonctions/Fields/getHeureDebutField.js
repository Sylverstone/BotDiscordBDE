import { TextInputStyle } from "discord.js";
import { getCustomField } from "./getCustomField.js";
export const getHeureDebutField = () => {
    return getCustomField("heureDebut", "Heure de début", TextInputStyle.Short, true);
};
