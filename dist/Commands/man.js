import { Colors, CommandInteraction, EmbedBuilder, SlashCommandStringOption } from "discord.js";
import "dotenv/config";
import * as path from "path";
import * as fs from "fs";
import __dirname from "../dirname.js";
import lookIfCommandsValid from "../Fonctions/lookIfCommandsValid.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import { pathToFileURL } from "url";
import make_log from "../Fonctions/makeLog.js";
import handleError from "../Fonctions/handleError.js";
import { capFirstLetter } from "../Events/interactionCreate.js";
export const description = "Cette commande vous permettra d'en apprendre plus sur l'utilisation d'une commande";
export const name = "man";
export const howToUse = "J'imagine que vous savez déjà utilsier /man :)";
export const onlyGuild = false;
let choices = await getChoices();
export const option = [
    new SlashCommandStringOption()
        .setName("commande")
        .setDescription("La commande que tu veux apprendre a utiliser")
        .setRequired(true)
        .addChoices(...choices),
];
async function getChoices() {
    let choices = [];
    const allCommandsScript = fs.readdirSync(path.join(__dirname, "Commands")).filter(file => {
        return file !== "man.js" && file.endsWith(".js");
    }).map(command => path.join(__dirname, "Commands", command));
    const additionalFile = fs.readdirSync(path.join(__dirname, "Commands"))
        .filter(file => !file.endsWith(".js"));
    for (let dos of additionalFile) {
        const additionalScript = fs.readdirSync(path.join(__dirname, "Commands", dos)).filter(file => !file.startsWith("_")).map(file => path.join(__dirname, "Commands", dos, file));
        allCommandsScript.push(...additionalScript);
    }
    for (const script of allCommandsScript) {
        const { name } = await import(pathToFileURL(script).href);
        choices.push({ name: name, value: name });
    }
    return choices;
}
export const run = async (bot, message, args) => {
    try {
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
            throw new Error("Command name must be a string");
        if (!lookIfCommandsValid(commandName))
            return message.reply(`La commande ${commandName} n'existe pas !`);
        //juste pour les dm
        const importPath = commandName === "event" || commandName === "reunion" ?
            pathToFileURL(path.join(__dirname, "Commands", capFirstLetter(commandName), commandName + ".js"))
            : pathToFileURL(path.join(__dirname, "Commands", commandName + ".js"));
        command = await import(importPath.href);
        const embedText = new EmbedBuilder()
            .setTitle(`Comment utiliser ${commandName}`)
            .setColor(Colors.Blue)
            .setDescription(command.howToUse)
            .setFooter({
            text: "Au plaisir de vous aidez",
            iconURL: bot.user?.displayAvatarURL() || ""
        });
        await displayEmbedsMessage(message, embedText);
        if (message instanceof CommandInteraction)
            make_log(true, message);
    }
    catch (error) {
        if (message instanceof CommandInteraction && error instanceof Error)
            handleError(message, error);
    }
};
