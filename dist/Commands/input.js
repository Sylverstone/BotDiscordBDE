import { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import "dotenv/config";
import handleError from "../Fonctions/handleError.js";
export const description = "input";
export const name = "input";
export const onlyGuild = true;
export const howToUse = "";
export const run = async (bot, message) => {
    try {
        const popup = new ModalBuilder({
            customId: message.id,
            title: "NO TITLE",
        });
        const but = new ButtonBuilder()
            .setLabel("Click")
            .setCustomId("+event")
            .setStyle(ButtonStyle.Danger);
        const ar = new ActionRowBuilder().addComponents(but);
        const nameInput = new TextInputBuilder()
            .setCustomId("nameInput")
            .setLabel("Ecrit ton prénom")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        /*
                const firstActionRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
                popup.addComponents(firstActionRow);
                await message.showModal(popup);
                const filter = (interaction : ModalSubmitInteraction) => interaction.customId === message.id;
                message.awaitModalSubmit({ filter, time : 30_000})
                .then(result => {
                    const nameValue = result.fields.getTextInputValue("nameInput");
        
                    result.reply("Your name is " + nameValue);
                })
        
         */
        message.reply({ components: [ar] });
    }
    catch (error) {
        if (error instanceof Error)
            handleError(message, error, true);
    }
};
