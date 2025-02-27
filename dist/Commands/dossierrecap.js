import { EmbedBuilder, MessageFlags, SlashCommandStringOption } from "discord.js";
import "dotenv/config";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import handleError from "../Fonctions/handleError.js";
import make_log from "../Fonctions/makeLog.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
export const description = "Cette commande vous donnes le lien de l'endroit où sont stocker les récapitulatifs de vos réunion";
export const name = "dossierrecap";
export const onlyGuild = true;
export const option = [
    new SlashCommandStringOption()
        .setName("lien_dossier_recap")
        .setDescription("Paramètre permettant de mettre le nouveau lien du dossier du récap")
        .setRequired(false),
];
export const howToUse = "Cette commande vous permet de récuper le dossier dans lequel sont stocké les récap de réunion de votre serveur.\nPour simplement récuperer ce dossier vous devez entrer `/dossierrecap`.\n si vous voulez changer ce lien entrez la commande `/dossierrecap 'lien'` où lien est le nouveau lien du dossier.";
export const run = async (bot, message) => {
    let haveParameters = false;
    haveParameters = message.options.data.length >= 1;
    if (!haveParameters) {
        await message.deferReply();
        getMostRecentValueFromDB(message, "lien_dossier_recap", "DossierRecap", "idDossierRecap", bot)
            .then(async (result) => {
            if (result) {
                await message.editReply("Voici le lien vers le dossier de récap : " + result);
            }
            else {
                await message.editReply("Il n'y a pas de lien vers le dossier récap :(");
            }
            make_log(true, message);
        })
            .catch(async (err) => {
            handleError(message, err, true);
        });
    }
    else {
        await message.deferReply({ flags: MessageFlags.Ephemeral });
        SaveValueToDB(message, bot, "DossierRecap", undefined, true)
            .then(result => {
            make_log(true, message);
            return displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Information")
                .setDescription("Le changement a bien été fait :)"), true);
        })
            .catch(async (err) => {
            handleError(message, err, true);
        });
    }
};
