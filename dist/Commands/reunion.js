import { EmbedBuilder, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import { createDate } from '../Fonctions/DateScript.js';
import { getLastId, getValueFromDB, SaveValueToDB } from '../Fonctions/DbFunctions.js';
import CreateEvent from '../Fonctions/CreateEvent.js';
import handleError from '../Fonctions/handleError.js';
import splitNumber from '../Fonctions/splitHeure.js';
import make_log from '../Fonctions/makeLog.js';
const description = "Cette commande permet de récuperer/set des infos sur la prochaine reunion";
const name = "reunion";
const onlyGuild = true;
export const howToUse = "`/reunion` vous permet de faire *2* choses.\nPremière utilisation : `/reunion` en entrant cette commande il vous sera retourner la date de la prochaine reunion, si elle existe.\nDeuxième utilisation : `/reunion 'date' 'sujet' 'lieu' 'info_en_plus' 'heuredebut' 'heurefin'`. Une deuxième réunion sera alors sauvegarder";
const option = [
    new SlashCommandStringOption()
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
        .setName("info_en_plus")
        .setRequired(false)
        .setDescription("Indiquez des infos supplémentaire si vous le souhaite")
];
const optionNum = [
    new SlashCommandNumberOption()
        .setName("heuredebut")
        .setRequired(false)
        .setDescription("Indiquez l'heure de début de la réunion"),
    new SlashCommandNumberOption()
        .setName("heurefin")
        .setRequired(false)
        .setDescription("Indiquez l'heure de fin de la réunion")
];
function isMaxId(result) {
    return (result !== null && typeof result === "object"
        && "maxId" in result && typeof result.maxId === "number");
}
function isReunion(result) {
    return (result !== null && typeof result === "object"
        && "date" in result && "sujet" in result
        && "lieu" in result && "info_en_plus" in result
        && "heuredebut" in result && "heurefin" in result);
}
function isReunionArray(result) {
    return Array.isArray(result) && result.every(row => isReunion(row));
}
const run = async (bot, message) => {
    try {
        handleRun(message, bot);
    }
    catch (error) {
        if (error instanceof Error) {
            handleError(message, error);
        }
    }
};
export { description, name, run, option, optionNum, onlyGuild };
async function handleRun(message, bot) {
    let option;
    //pour savoir si l'objet a été init
    let ObjectIsReal = false;
    let optionObject = {};
    option = message.options.data;
    if (option !== null) {
        option.forEach(o => { optionObject[o.name] = o.value; ObjectIsReal = true; });
    }
    if (!ObjectIsReal) {
        await getValueFromDB(message, "date, heuredebut, heurefin, lieu, info_en_plus, sujet", "Reunion", "idReunion", bot)
            .then(async (result) => {
            if (result === null)
                return message.reply("Il n'y a pas de reunion l'instant.");
            if (isReunionArray(result)) {
                const dateTemp = new Date();
                const dateActu = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate());
                dateActu.setHours(dateTemp.getHours());
                const allfuturReunion = result.filter((row) => {
                    const date = createDate(row.date);
                    if (!(date instanceof Date))
                        return;
                    return date > dateActu;
                });
                let NearestReunion;
                if (allfuturReunion.length > 0) {
                    NearestReunion = allfuturReunion[0];
                    allfuturReunion.forEach((row) => {
                        const date = createDate(row.date);
                        if (!(date instanceof Date))
                            return;
                        if (!(isReunion(NearestReunion)))
                            return;
                        const temp_date = createDate(NearestReunion.date);
                        if (!(temp_date instanceof Date))
                            return;
                        if (date < temp_date)
                            NearestReunion = row;
                    });
                }
                else {
                    NearestReunion = null;
                }
                if (isReunion(NearestReunion)) {
                    const { date, sujet, heuredebut, heurefin, lieu, info_en_plus } = NearestReunion;
                    const infoEnPlusText = info_en_plus === "" ? "" : "Info en plus : " + info_en_plus;
                    const [integerPart, DecimalPart] = splitNumber(heuredebut);
                    const [integerPartFin, DecimalPartFin] = splitNumber(heurefin);
                    const embedText = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle(`Prochaine réunion - ${sujet}`)
                        .setDescription(`date : ${date}\n
                                        heure : ${integerPart}h${DecimalPart} -> ${integerPartFin}h${DecimalPartFin}\n
                                        lieu : ${lieu}\n
                                        ${infoEnPlusText}`)
                        .setFooter({
                        text: "Au plaisir de vous aidez",
                        iconURL: bot.user?.displayAvatarURL() || ""
                    });
                    make_log(true, message);
                    return message.reply({ embeds: [embedText] });
                }
                else {
                    make_log(true, message);
                    return message.reply("Il n'y a pas de prochaine reunion prévu pour l'instant.\n");
                }
            }
            return message.reply("Il n'y a pas de reunion l'instant.");
        });
    }
    else {
        //verifier si o
        // n peut creer la reunion
        if (!("info_en_plus" in optionObject)) {
            optionObject["info_en_plus"] = "Pas d'informations en plus";
        }
        if (!isReunion(optionObject))
            return message.reply("La définition de la réunion n'est pas complète :(");
        const optionReunion = optionObject;
        const dateActu = new Date();
        const dateDebut = createDate(optionReunion.date);
        const [stringIntegerPart, stringDecimalPart] = splitNumber(optionReunion.heuredebut);
        const [stringIntegerPartFin, stringDecimalPartFin] = splitNumber(optionReunion.heurefin);
        const dateFin = createDate(optionReunion.date);
        if (!(dateFin instanceof Date && dateDebut instanceof Date))
            return message.reply("ntm");
        dateDebut.setHours((+stringIntegerPart), stringDecimalPart);
        dateFin.setHours((+stringIntegerPartFin), stringDecimalPartFin);
        console.log("date debut  :", dateDebut.toString(), "\n", dateActu);
        if (dateActu.getTime() > dateDebut.getTime())
            return message.reply("La reunion ne peut pas être défini dans le passé");
        const finalObjectEvent = {
            date: optionReunion.date,
            sujet: optionReunion.sujet,
            lieu: optionReunion.lieu,
            info_en_plus: optionReunion.info_en_plus,
            heuredebut: optionReunion.heuredebut,
            heurefin: optionReunion.heurefin
        };
        SaveValueToDB(message, bot, "Reunion", finalObjectEvent)
            .then(async (result) => {
            console.log("command succes -author:", message.user.username);
            const sujet = optionReunion.sujet;
            const lieu = optionReunion.lieu;
            const info_en_plus = optionReunion.info_en_plus;
            console.log("date :", dateDebut, dateFin);
            const res = await getLastId("Reunion", "idReunion", bot);
            console.log(res);
            if (!isMaxId(res))
                return;
            const id = res.maxId;
            await CreateEvent(message, sujet, dateDebut, dateFin, lieu, info_en_plus, "Reunion", id);
            make_log(true, message);
            return message.reply({ content: `La réunion à été crée !` });
        })
            .catch(err => {
            handleError(message, err);
        });
    }
}
