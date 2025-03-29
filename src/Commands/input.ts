import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder, ModalSubmitInteraction, ButtonBuilder
} from "discord.js";
import "dotenv/config";
import { getMostRecentValueFromDB, SaveValueToDB } from "../Fonctions/DbFunctions.js";
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import make_log from "../Fonctions/makeLog.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";

export const description = "input";
export const name = "input";
export const onlyGuild = true;


export const howToUse = "";

export const  run = async(bot : CBot, message : CommandInteraction) => {
    try{
        const popup = new ModalBuilder({
            customId : message.id,
            title : "NO TITLE",

        })

        const nameInput = new TextInputBuilder()
            .setCustomId("nameInput")
            .setLabel("Ecrit ton prénom")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        popup.addComponents(firstActionRow);
        await message.showModal(popup);
        const filter = (interaction : ModalSubmitInteraction) => interaction.customId === message.id;
        message.awaitModalSubmit({ filter, time : 30_000})
        .then(result => {
            const nameValue = result.fields.getTextInputValue("nameInput");

            result.reply("Your name is " + nameValue);
        })
    }
    catch(error)
    {
        if(error instanceof Error)
            handleError(message,error,true);
    }


}