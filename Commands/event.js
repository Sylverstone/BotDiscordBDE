import { Client, CommandInteraction, EmbedBuilder,hyperlink, Message,SlashCommandStringOption } from "discord.js";
import verifierDate, { createDate } from "../Fonctions/DateScript.js";
import { SaveValueToDB, getMostRecentValueFromDB } from "../Fonctions/DbFunctions.js";
import dotenv from "dotenv";
import __dirname from "../dirname.js";
import transfromOptionToObject from "../Fonctions/transfromOptionToObject.js";
dotenv.config();

export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "event";

export const howToUse = "`/event` vous permet de faire *2* choses.\nPremière utilisation : `/event` en entrant cette commande il vous sera retourner des informations sur le dernier évènements.\nDeuxième utilisation : `/event name date more` Ici les Concerne des nou"

export const option = [
    new SlashCommandStringOption()
    .setName("name")
    .setDescription("le nom de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("date")
    .setDescription("le date de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("lieu")
    .setDescription("le lieu de l'évènements")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("more")
    .setDescription("Lien pour en savoir plus")
    .setRequired(false),
    new SlashCommandStringOption()
    .setName("heure")
    .setDescription("heure de l'évènements")
    .setRequired(false)

]
const getDataEvent = (Ev) => {
    const textInfoPlus = Ev.more ===  "Aucune info en plus n'a été fournit" ? Ev.more +"." : `${hyperlink("Ici",Ev.more)} vous pourrez retrouvez plus d'information :)`
    return `Le prochaine évènements est : \`${Ev.name}\` et il aura lieu le \`${Ev.date}\` à \`'${Ev.lieu}'\` sur la plage horaire \`${Ev.heure}\`.\n${textInfoPlus}`
    
}
export const  run = async(bot, message) => {
    if(!(bot instanceof Client && (message instanceof CommandInteraction))) return;
    try {
        console.log(message.user, "is running event")
        let {ObjectIsReal, optionObject} = transfromOptionToObject(message)

        if(!ObjectIsReal)
        {
            
            const objectEvent = await getMostRecentValueFromDB(message,"lieu, more, date, name, heure","Event","id",bot)
            if(objectEvent !== null)
            {
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
                console.log("command succes -author:",message.user);
                return message.reply({embeds : [embedText]})
            }
            return message.reply("Il n'y a pas d'event planifié...");
            
        }
        else
        {
            const finalObjectEvent = {
                name : optionObject.name || "Aucun nom n'a été transmis",
                date : optionObject.date || "Aucune date n'a été transmise",
                lieu : optionObject.lieu || "Aucun lieu n'a été transmis",
                more : optionObject.more || "Aucune info en plus n'a été fournit",
              heure : optionObject.heure || "Aucune plage horaire n'a été fournit",
            }
            
            SaveValueToDB(message,bot,"Event",finalObjectEvent)
            .then(result => {
                console.log("command succes -author:",message.user);
                return message.reply({content : `Le changement a bien été fait ! :)`})
            })
            .catch(err => {throw err});
            
        }
    } catch (error) {
        console.log("command went wrong while",message.user,"was running it\n",error)
        return message.reply("Une erreur est survenue lors de l'exécution de cette commande :(")
    }

    
}