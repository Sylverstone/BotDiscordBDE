import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, EmbedBuilder } from "discord.js";
import handleError from "../Fonctions/handleError.js";
import 'dotenv/config';
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import { Color } from "../Enum/Color.js";
export const description = "Cette commande vous permet de supprimer un évènement en selectionnant";
export const name = "sup_event";
export const howToUse = "`/sup_event Vous afficheras les évènements présent dans votre serveur, et vous pourrez les supprimés en les selectionnat";
/*
export const option = [
    new SlashCommandStringOption()
    .setName("nom_reunion")
    .setDescription("le nom de la reunion")
    .setRequired(true)
];
*/
export const onlyGuild = true;
export const run = async (bot, message) => {
    try {
        const guild = message.guild;
        if (!guild) {
            throw new Error("Guild inexistante");
        }
        const events = await guild.scheduledEvents.fetch();
        let eventList = [];
        events.forEach((e) => {
            const data = {
                label: e.name,
                value: e.name,
            };
            if (e.description)
                data.description = e.description;
            eventList.push(data);
        });
        if (eventList.length <= 0) {
            await displayEmbedsMessage(message, new EmbedBuilder()
                .setTitle("Aucun évènement")
                .setDescription("Il n'y a pas d'évènement !")
                .setColor(Color.successColor));
            return;
        }
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(message.id)
            .setPlaceholder("Choisissez l'évènement")
            .setMinValues(0)
            .setMaxValues(eventList.length)
            .addOptions(eventList.map((eventData) => new StringSelectMenuOptionBuilder()
            .setLabel(eventData.label)
            .setDescription(eventData.description !== undefined ? eventData.description : "")
            .setValue(eventData.value)));
        const actionRow = new ActionRowBuilder().addComponents(selectMenu);
        if (!message.isChatInputCommand())
            return;
        const reply = await message.reply({ components: [actionRow] });
        //Recuperer la réponse de l'utilisateur quand il a validé sa saisie
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === message.user.id && i.customId === message.id,
            time: 60000
        });
        collector.on("collect", async (interaction) => {
            const length = interaction.values.length;
            if (!length) {
                interaction.reply("OK");
            }
            else {
                for (const eventName of interaction.values) {
                    const events = await guild.scheduledEvents.fetch();
                    const cibleEvent = events.find((e) => e.name === eventName);
                    if (cibleEvent)
                        await cibleEvent.delete();
                }
                let phrase = length > 0 ? "Les évènements : " : "L'évènement :";
                for (let i = 0; i < interaction.values.length - 1; i++) {
                    phrase += interaction.values[i] + ", ";
                }
                phrase += interaction.values[interaction.values.length - 1];
                phrase += length > 0 ? " ont été supprimés" : " a été supprimé";
                await displayEmbedsMessage(interaction, new EmbedBuilder()
                    .setTitle("Reussite")
                    .setDescription(phrase)
                    .setColor(Color.successColor));
            }
        });
    }
    catch (Err) {
        if (Err instanceof Error) {
            handleError(message, Err);
        }
    }
};
