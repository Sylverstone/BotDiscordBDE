import { Client, CommandInteraction, EmbedBuilder,hyperlink, Message,SlashCommandStringOption } from "discord.js";
import verifierDate, { createDate } from "../Fonctions/DateScript.js";
import { changeSpecialValueFromFIle } from "../Fonctions/changeValueFromFile.js";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import __dirname from "../dirname.js";
dotenv.config();

export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "event";

export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/recap` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event name date more` Ici les Concerne des nou"

export const option = [
    new SlashCommandStringOption()
    .setName("nom_evenement")
    .setDescription("le nom de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("date_evenement")
    .setDescription("le date de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("lieu_evenement")
    .setDescription("le lieu de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("more")
    .setDescription("Lien pour en savoir plus")
    .setRequired(false),

]
const getDataEvent = (Ev) => {
    return `Le prochaine évènements est : \`${Ev.name}\` et il aura lieu le \`${Ev.date}\` à \`'${Ev.lieu}'\`.\n${hyperlink("Ici",Ev.more)} vous pourrez retrouvez plus d'information :)`
    
}
export const  run = async(bot, message, args = []) => {
    if(!(bot instanceof Client && (message instanceof Message || message instanceof CommandInteraction) && args instanceof Array)) return;
    try {
        console.log(message.author.username, "is running event")
        let option;
        //pour savoir si l'objet a été init
        let ObjectIsReal = false;
        let optionObject = {};
        const ListeParam = ["nom_evenement","date_evenement","lieu_evenement","more"]
        if(message instanceof CommandInteraction)
        {
            option = message.options.data;
            if(option !== null)
            {
                option.forEach(o => {optionObject[o.name] = o.value; ObjectIsReal = true;});
            }
        }
        else
        {
            args.forEach((value,index) => {optionObject[ListeParam[index]] = value; ObjectIsReal = true});
        }


        console.log(optionObject)
        if(!ObjectIsReal)
        {
            const jsonPath = path.join(__dirname,"JSON","data.json");
            let JsonFile = JSON.parse(fs.readFileSync(jsonPath,"utf-8"));
            const objectEvent = JsonFile.prochainEnv;
            const dateEvn = createDate(objectEvent.date);
            const dateActu = new Date();
            const eventOutDated = !verifierDate(dateActu,dateEvn,true);
            const textEnv = eventOutDated === false ? getDataEvent(objectEvent) : "Le prochaine Event n'est pas encore planifié\n Voici tout de même les infos de l'ancien évènements :\n" + getDataEvent(objectEvent);

            const embedText = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(objectEvent.name)
                .setFooter({
                    text: "Au plaisr de vous aidez",
                    iconURL: bot.user?.displayAvatarURL() || ""
                })
                .setDescription(textEnv)
            console.log("command succes -author:",message.author.username);
            return message.reply({embeds : [embedText]})
        }
        else
        {
            const finalObjectEvent = {
                name : optionObject.nom_evenement || "pas de nom",
                date : optionObject.date_evenement || "pas de date",
                lieu : optionObject.lieu_evenement || "pas de lieu",
                more : optionObject.more || "pas de more"
            }
            changeSpecialValueFromFIle("prochainEnv",finalObjectEvent)
            console.log("command succes -author:",message.author.username);
            return message.reply({content : `Le changement a bien été fait ! :)`})
        }
    } catch (error) {
        console.log("command went wrong while",message.author.username,"was running it\n",error)
        return message.reply("Une erreur est survenue lors de l'exécution de cette commande :(")
    }

    
}