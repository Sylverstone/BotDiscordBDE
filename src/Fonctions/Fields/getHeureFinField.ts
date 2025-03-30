import { TextInputStyle} from "discord.js";
import {getCustomField} from "./getCustomField.js";

export const getHeureFinField = () =>
{
    return getCustomField("heureFin","Heure de fin",TextInputStyle.Short,true);
}
