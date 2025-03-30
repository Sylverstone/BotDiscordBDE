import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, EmbedBuilder } from "discord.js";
import "dotenv/config";
import * as path from "path";
import * as fs from "fs";
import __dirname from "../dirname.js";
import { isScript_t } from "../Class/CBot.js";
import { pathToFileURL } from "url";
import handleError from "../Fonctions/handleError.js";
import { Color } from "../Enum/Color.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
export const description = "Cette commande vous permettra d'en apprendre plus sur l'utilisation d'une commande";
export const name = "man";
export const howToUse = "J'imagine que vous savez déjà utilsier /man :)";
export const onlyGuild = true;
async function getChoices() {
    let choices = [];
    const allCommandsScript = fs.readdirSync(path.join(__dirname, "Commands")).filter(file => {
        return file !== "man.js" && file.endsWith(".js");
    }).map(command => path.join(__dirname, "Commands", command));
    //Contient les dossier de commandes
    const additionalFile = fs.readdirSync(path.join(__dirname, "Commands"))
        .filter(file => !file.endsWith(".js"));
    //iterer sur les dossier afin d'inclure leur fichier
    for (let dos of additionalFile) {
        //Contient les fichiers principaux du dossier. si le fichier commence par _, c'est un fichier a import.
        const additionalScript = fs.readdirSync(path.join(__dirname, "Commands", dos)).filter(file => !file.startsWith("_")).map(file => path.join(__dirname, "Commands", dos, file));
        allCommandsScript.push(...additionalScript);
    }
    for (const script of allCommandsScript) {
        const { name, description } = await import(pathToFileURL(script).href);
        if (name && description) {
            choices.push({
                label: name,
                value: script,
                description: description,
            });
        }
    }
    return choices;
}
export const run = async (bot, message) => {
    try {
        const listeScript = await getChoices();
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(message.id)
            .setPlaceholder("Choisissez une commande")
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(listeScript.map(v => new StringSelectMenuOptionBuilder()
            .setDescription(v.description !== undefined ? v.description : "")
            .setValue(v.value)
            .setLabel(v.label)));
        const actionRow = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await message.reply({ components: [actionRow] });
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 100000
        });
        collector.on("collect", async (interaction) => {
            if (!interaction.values.length) {
                await interaction.reply("OK");
                return;
            }
            if (interaction.values.length > 1) {
                await interaction.reply("HOW");
                return;
            }
            const pathToCommand = interaction.values[0];
            console.log(pathToCommand);
            const command = await import(pathToFileURL(pathToCommand).href);
            if (!isScript_t(command)) {
                await interaction.reply("ERR");
                return;
            }
            const { howToUse, name } = command;
            const embedText = new EmbedBuilder()
                .setTitle(`Comment utiliser ${name}`)
                .setColor(Color.successColor)
                .setDescription(howToUse)
                .setFooter({
                text: "Au plaisir de vous aidez",
                iconURL: bot.user?.displayAvatarURL() || ""
            });
            await displayEmbedsMessage(interaction, embedText);
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error)
            handleError(message, error);
    }
};
