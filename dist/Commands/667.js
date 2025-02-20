import { EmbedBuilder, SlashCommandUserOption } from "discord.js";
import "dotenv/config";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import handleError from "../Fonctions/handleError.js";
export const description = "un secret";
export const name = "667";
export const onlyGuild = true;
export const howToUse = "Vous ne pouvez pas savoir comment utiliser cette commande";
export const optionUser = [
    new SlashCommandUserOption()
        .setName("cible")
        .setDescription("jsp")
        .setRequired(true),
];
export const run = async (bot, message) => {
    if (!message.guild)
        return;
    const param_name = message.options.get("cible");
    if (!param_name)
        return;
    const cible = param_name.value;
    console.log(cible);
    const listOfMembers = await message.guild.members.fetch();
    const member = listOfMembers.find(m => m.user.id === cible);
    listOfMembers.forEach(member => console.log(member.user.username, member.user.globalName));
    if (member) {
        try {
            console.log("cible reconnue :", member);
            member.ban({ reason: "why not " });
            displayEmbedsMessage(message, new EmbedBuilder().setTitle("bannissement").setDescription(`l'utilisateur : ${member.user.username} a été banni`));
        }
        catch (Err) {
            if (Err instanceof Error) {
                handleError(message, Err);
            }
        }
        return;
    }
    displayEmbedsMessage(message, new EmbedBuilder()
        .setTitle("bannissement")
        .setDescription(`Une erreur a eu lieu`));
    return;
};
