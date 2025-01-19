import { EmbedBuilder, SlashCommandIntegerOption, SlashCommandStringOption } from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { getValueFromDB, SaveValueToDB } from '../Fonctions/DbFunctions.js';
import CreateEvent from '../Fonctions/CreateEvent.js';
import handleError from '../Fonctions/handleError.js';
const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";
const name = "reunion";
const onlyGuild = true;
const option = [new SlashCommandStringOption()
        .setName("date")
        .setRequired(false)
        .setDescription("Paramètre permettant de définir une nouvelles dates :)"),
    new SlashCommandStringOption()
        .setName("sujet")
        .setRequired(false)
        .setDescription("indiquez le lieu de sujet de la reunion"),
    new SlashCommandStringOption()
        .setName("lieu")
        .setRequired(false)
        .setDescription("Indiquez le lieu de la réunion"),
    new SlashCommandStringOption()
        .setName("more")
        .setRequired(false)
        .setDescription("Indiquez des infos supplémentaire si vous le souhaite")
];
const optionInt = [
    new SlashCommandIntegerOption()
        .setName("heuredebut")
        .setRequired(false)
        .setDescription("Indiquez l'heure de début de la réunion"),
    new SlashCommandIntegerOption()
        .setName("heurefin")
        .setRequired(false)
        .setDescription("Indiquez l'heure de fin de la réunion")
];
function isReunion(result) {
    return (result !== null && typeof result === "object"
        && "date" in result && "sujet" in result
        && "lieu" in result && "more" in result
        && "heuredebut" in result && "heurefin" in result);
}
function isReunionArray(result) {
    return Array.isArray(result) && result.every(row => isReunion(row));
}
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion paramètre` Ici le 'paramètre' est la date de la nouvelle reunion, le format est de la date est jj/mm/yyyy où jj-mm-yyyy ( exemple : 08/01/2006 ). La commande va donc sauvegarder la prochaine date de reunion.\n PS: si vous utilisez un argument, TOUT les autres sont nécéssaires sauf \`more\`";
const run = async (bot, message) => {
    try {
        console.log(message.user, "is running reunion");
        handleRun(message, bot);
    }
    catch (error) {
        console.log("command went wrong while", message.user.tag, "was running it\n", error);
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
};
export { description, name, run, option, optionInt, onlyGuild };
async function handleRun(message, bot) {
    console.log(message.user, "is running event");
    let option;
    //pour savoir si l'objet a été init
    let ObjectIsReal = false;
    let optionObject = {};
    option = message.options.data;
    if (option !== null) {
        option.forEach(o => { optionObject[o.name] = o.value; ObjectIsReal = true; });
    }
    if (!ObjectIsReal) {
        await getValueFromDB(message, "date, heuredebut, heurefin, lieu, more, sujet", "Reunion", "idReunion", bot)
            .then(async (result) => {
            if (result === null)
                return message.reply("Il n'y a pas de reunion l'instant.");
            if (isReunionArray(result)) {
                const dateTemp = new Date();
                const dateActu = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate());
                dateActu.setHours(dateTemp.getHours());
                const allfuturReunion = result.filter((row) => {
                    const date = createDate(row.date);
                    return date > dateActu;
                });
                let NearestReunion;
                if (allfuturReunion.length > 0) {
                    NearestReunion = allfuturReunion[0];
                    allfuturReunion.forEach((row) => {
                        const date = createDate(row.date);
                        if (!(isReunion(NearestReunion)))
                            return;
                        if (date < createDate(NearestReunion.date))
                            NearestReunion = row;
                    });
                }
                else {
                    NearestReunion = null;
                }
                if (isReunion(NearestReunion)) {
                    const { date, sujet, heuredebut, heurefin, lieu, more } = NearestReunion;
                    const infoEnPlusText = more === "" ? "" : "Info en plus : " + more;
                    const embedText = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle(`Prochaine réunion - ${sujet}`)
                        .setDescription(`date : ${date}\n
                                        heure : ${heuredebut} -> ${heurefin}\n
                                        lieu : ${lieu}\n
                                        ${infoEnPlusText}`)
                        .setFooter({
                        text: "Au plaisir de vous aidez",
                        iconURL: bot.user?.displayAvatarURL() || ""
                    });
                    return message.reply({ embeds: [embedText] });
                }
                else {
                    return message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.\n");
                }
            }
            return message.reply("Il n'y a pas de reunion l'instant.");
        });
    }
    else {
        //verifier si o
        // n peut creer la reunion
        if (!("more" in optionObject)) {
            optionObject["more"] = "Pas d'informations en plus";
        }
        if (!isReunion(optionObject))
            return message.reply("La définition de la réunion n'est pas complète :(");
        const optionReunion = optionObject;
        const dateActu = new Date();
        const dateDebut = createDate(optionReunion.date);
        if (dateActu > dateDebut)
            return message.reply("La reunion ne peut pas être défini dans le passé");
        const finalObjectEvent = {
            date: optionReunion.date,
            sujet: optionReunion.sujet,
            lieu: optionReunion.lieu,
            more: optionReunion.more,
            heuredebut: optionReunion.heuredebut,
            heurefin: optionReunion.heurefin
        };
        SaveValueToDB(message, bot, "Reunion", finalObjectEvent)
            .then(async (result) => {
            console.log("command succes -author:", message.user);
            dateDebut.setHours(optionReunion.heuredebut);
            const dateFin = createDate(optionReunion.date);
            dateFin.setHours(optionReunion.heurefin);
            const sujet = optionReunion.sujet;
            const lieu = optionReunion.lieu;
            const more = optionReunion.more;
            await CreateEvent(message, sujet, dateDebut, dateFin, lieu, more, "Reunion");
            return message.reply({ content: `La réunion à été crée !` });
        })
            .catch(err => {
            handleError(message, err);
        });
    }
}
