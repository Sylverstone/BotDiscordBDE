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
        /*
        let command;
        let commandName;
        if(message instanceof CommandInteraction)
        {
            const option = message.options.get("commande");
            commandName = option?.value;
        }
        else
        {
            if(args.length === 0) return message.reply("La commande !man doit OBLIGATOIREMENT avoir un paramètre");
            commandName = args[0];
        }

        if(!(typeof commandName === 'string')) throw new Error("Command name must be a string");

        if(!lookIfCommandsValid(commandName)) return message.reply(`La commande ${commandName} n'existe pas !`);
        //juste pour les dm
        
        const importPath = commandName === "event" || commandName === "reunion" ?
            pathToFileURL(path.join(__dirname,"Commands",capFirstLetter(commandName), commandName + ".js"))
            : pathToFileURL(path.join(__dirname,"Commands",commandName + ".js"));

        command = await import(importPath.href);
                
        const embedText = new EmbedBuilder()
        .setTitle(`Comment utiliser ${commandName}`)
        .setColor(Colors.Blue)
        .setDescription(command.howToUse)
        .setFooter({
            text: "Au plaisir de vous aidez",
            iconURL: bot.user?.displayAvatarURL() || ""
        });
       
        await displayEmbedsMessage(message,embedText);
        if(message instanceof CommandInteraction)
            make_log(true,message);

         */
        const listeScript = await getChoices();
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(message.id)
            .setPlaceholder("Choisissez la commande sur laquelle vous voulez en savoir plus :)")
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
            filter: (i) => i.user.id === message.user.id && i.customId === message.id,
            time: 60000
        });
        collector.on("collect", async (interaction) => {
            await interaction.deferReply();
            if (!interaction.values.length) {
                await interaction.editReply("OK");
                return;
            }
            if (interaction.values.length > 1) {
                await interaction.editReply("HOW");
                return;
            }
            const pathToCommand = interaction.values[0];
            console.log(pathToCommand);
            const command = await import(pathToFileURL(pathToCommand).href);
            if (!isScript_t(command)) {
                await interaction.editReply("ERR");
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
            await displayEmbedsMessage(interaction, embedText, true);
        });
    }
    catch (error) {
        if (error instanceof Error)
            handleError(message, error);
    }
};
