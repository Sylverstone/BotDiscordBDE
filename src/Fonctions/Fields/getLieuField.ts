import {TextInputStyle} from "discord.js";
import {getCustomField} from "./getCustomField.js";

export const getLieuField = () =>
{
    return getCustomField("lieu","Lieu",TextInputStyle.Short,true,"Il se passe où cet évènement ?");
}