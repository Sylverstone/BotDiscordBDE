import { CommandInteraction, EmbedBuilder, Message, SlashCommandStringOption } from "discord.js";
import "dotenv/config";
import * as path from "path";
import * as fs from "fs";
import __dirname from "../dirname.js";
import lookIfCommandsValid from "../Fonctions/lookIfCommandsValid.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import { pathToFileURL } from "url";
import make_log from "../Fonctions/makeLog.js";
import handleError from "../Fonctions/handleError.js";
export const description = "Cette commande vous permettra d'en apprendre plus sur l'utilisation d'une commande";
export const name = "man";
export const howToUse = "J'imagine que vous savez déjà utilsier /man :)";
export const onlyGuild = false;
let choices = await getChoices();
export const option = [
    new SlashCommandStringOption()
        .setName("commande")
        .setDescription("La commande que tu apprendres a utiliser")
        .setRequired(true)
        .addChoices(...choices),
];
async function getChoices() {
    let choices = [];
    const allCommandsScript = fs.readdirSync(path.join(__dirname, "Commands")).filter(file => file !== "man.js");
    for (const script of allCommandsScript) {
        const { name } = await import(pathToFileURL(path.join(__dirname, "Commands", script)).href);
        choices.push({ name: name, value: name });
    }
    return choices;
}
const handleRun = async (version, message, args, bot) => {
    let command;
    let commandName;
    if (message instanceof CommandInteraction) {
        const option = message.options.get("commande");
        commandName = option?.value;
    }
    else {
        if (args.length === 0)
            return message.reply("La commande !man doit OBLIGATOIREMENT avoir un paramètre");
        commandName = args[0];
    }
    if (!(typeof commandName === 'string'))
        return;
    if (!lookIfCommandsValid(commandName))
        return message.reply(`La commande ${commandName} n'existe pas !`); //juste pour les dm
    const author_name = message instanceof Message ? message.author : message.user;
    try {
        command = await import(pathToFileURL(path.join(__dirname, "Commands", commandName + ".js")).href);
        const embedText = new EmbedBuilder()
            .setTitle(`Comment utiliser ${commandName}`)
            .setDescription(command.howToUse)
            .setFooter({
            text: "Au plaisir de vous aidez",
            iconURL: bot.user?.displayAvatarURL() || ""
        });
        displayEmbedsMessage(message, embedText);
        if (message instanceof CommandInteraction)
            make_log(true, message);
    }
    catch (error) {
        if (message instanceof CommandInteraction && error instanceof Error)
            handleError(message, error);
    }
};
export const run = async (bot, message, args) => {
    const author_name = message instanceof Message ? message.author : message.user;
    if (message instanceof CommandInteraction) {
        console.log("there");
        handleRun(0, message, args, bot);
        return;
    }
    handleRun(1, message, args, bot);
};
