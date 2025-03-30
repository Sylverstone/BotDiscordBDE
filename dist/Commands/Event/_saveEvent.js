import { EmbedBuilder, MessageFlags, ModalBuilder, TextInputStyle } from "discord.js";
import { createDate, setup_date, verifLogicDateWithoutHour } from "../../Fonctions/DateScript.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import { SaveValueToDB } from "../../Fonctions/DbFunctions.js";
import CreateEvent from "../../Fonctions/CreateEvent.js";
import handleError from "../../Fonctions/handleError.js";
import { Color } from "../../Enum/Color.js";
import { sendButton } from "../../Fonctions/sendButton.js";
import { getLieuField } from "../../Fonctions/Fields/getLieuField.js";
import { getHeureDebutField } from "../../Fonctions/Fields/getHeureDebutField.js";
import { getHeureFinField } from "../../Fonctions/Fields/getHeureFinField.js";
import { getDescriptionField } from "../../Fonctions/Fields/getDescriptionField.js";
import { getCustomField } from "../../Fonctions/Fields/getCustomField.js";
export default async function saveEvent(message, bot, phase = 1) {
    console.log(phase);
    console.log("create event");
    const popup = new ModalBuilder({
        customId: "CreateEvent1",
        title: "Créer votre évènement (" + phase + "/2)",
    });
    //Nom
    const eventNameActionRow = getCustomField("eventName", "Nom", TextInputStyle.Short, true, "Rentrez le nom de votre super évènement");
    //date de début
    const dateDebutFieldActionRow = getCustomField("dateDebut", "Date de début", TextInputStyle.Short, true, "Format : jj-mm-aaaa où jj/mm/aaaa");
    //Date de fin
    const dateFinFieldActionRow = getCustomField("dateFin", "Date de fin", TextInputStyle.Short, true, "Format : jj-mm-aaaa où jj/mm/aaaa");
    //lieu. customId : lieu
    const lieuFieldActionRow = getLieuField();
    //heure de début. customId : heureDebut
    const heureDebutFieldActionRow = getHeureDebutField();
    //heure de fin
    const heureFinFieldActionRow = getHeureFinField();
    //info en plus
    const additionalInfoFieldActionRow = getDescriptionField();
    if (phase === 1) {
        popup.addComponents(eventNameActionRow)
            .addComponents(lieuFieldActionRow)
            .addComponents(dateDebutFieldActionRow)
            .addComponents(dateFinFieldActionRow);
    }
    else {
        popup.addComponents(heureDebutFieldActionRow)
            .addComponents(heureFinFieldActionRow)
            .addComponents(additionalInfoFieldActionRow);
    }
    await message.showModal(popup);
    const filter = (interaction) => interaction.customId === "CreateEvent1";
    message.awaitModalSubmit({ filter, time: 30000000 })
        .then(async (result) => {
        if (!result.guild)
            return;
        const id = result.guild.id;
        if (phase === 1) {
            try {
                bot.eventData[+id].name = result.fields.getTextInputValue("eventName");
                bot.eventData[+id].datedebut = result.fields.getTextInputValue("dateDebut");
                bot.eventData[+id].datefin = result.fields.getTextInputValue("dateFin");
                const tdate = bot.eventData[+id].datedebut;
                const tdate2 = bot.eventData[+id].datefin;
                if (typeof tdate !== "string" || typeof tdate2 !== "string")
                    return;
                const tDate1 = createDate(tdate);
                const tDate2 = createDate(tdate2);
                if (tDate1 === undefined || tDate2 === undefined) {
                    await displayEmbedsMessage(result, new EmbedBuilder()
                        .setColor(Color.failureColor)
                        .setDescription("Les dates ne sont pas bonnes")
                        .setTitle("Erreur"));
                    return;
                }
                if (!verifLogicDateWithoutHour(tDate1, tDate2)) {
                    await displayEmbedsMessage(result, new EmbedBuilder()
                        .setColor(Color.failureColor)
                        .setDescription("La date n'est pas bonne.\nRaison possible :\n-Définition dans le passé\n-date de fin > date début")
                        .setTitle("Erreur"));
                    return;
                }
                bot.eventData[+id].lieu = result.fields.getTextInputValue("lieu");
                await sendButton(result, "+event" /* customId.event */);
            }
            catch (e) {
                if (e instanceof Error) {
                    handleError(result, e);
                }
            }
        }
        else {
            try {
                await result.deferReply({ flags: MessageFlags.Ephemeral });
                bot.eventData[+id].info_en_plus = result.fields.getTextInputValue("info_en_plus");
                const heureDebut = result.fields.getTextInputValue("heureDebut");
                const heureFin = result.fields.getTextInputValue("heureFin");
                if (isNaN(parseFloat(heureDebut)) || isNaN(parseFloat(heureFin))) {
                    await displayEmbedsMessage(result, new EmbedBuilder()
                        .setColor(Color.failureColor)
                        .setDescription("Les heures ne sont pas bonnes")
                        .setTitle("Erreur"), true);
                    return;
                }
                bot.eventData[+id].heuredebut = parseFloat(heureDebut);
                bot.eventData[+id].heurefin = parseFloat(heureFin);
                console.table(bot.eventData);
                const optionEvent = bot.eventData;
                const tdate = bot.eventData[+id].datedebut;
                const tdate2 = bot.eventData[+id].datefin;
                if (typeof tdate !== "string" || typeof tdate2 !== "string")
                    return;
                const DateCreation = setup_date(tdate, tdate2, optionEvent[+id].heuredebut, optionEvent[+id].heurefin, result);
                if (!DateCreation)
                    return;
                const dateDebutEvent = DateCreation[0];
                const dateFinEvent = DateCreation[1];
                const finalObjectEvent = {
                    name: optionEvent[+id].name,
                    datedebut: dateDebutEvent.toString(),
                    datefin: dateFinEvent.toString(),
                    heuredebut: optionEvent[+id].heuredebut,
                    heurefin: optionEvent[+id].heurefin,
                    lieu: optionEvent[+id].lieu,
                    info_en_plus: optionEvent[+id].info_en_plus,
                };
                const EventList = await message.guild?.scheduledEvents.fetch();
                if (typeof EventList?.find(event => event.name === optionEvent[+id].name) !== "undefined") {
                    await displayEmbedsMessage(result, new EmbedBuilder()
                        .setTitle("Erreur")
                        .setDescription("Un évènement avec le même nom existe déjà"), true);
                    return;
                }
                SaveValueToDB(result, bot, "Event", finalObjectEvent)
                    .then(async (r) => {
                    const name = optionEvent[+id].name;
                    const lieu = optionEvent[+id].lieu;
                    const info_en_plus = optionEvent[+id].info_en_plus;
                    if (name === undefined || lieu === undefined || info_en_plus === undefined)
                        return;
                    //on envoie le mess dans ça
                    CreateEvent(result, name, dateDebutEvent, dateFinEvent, lieu, info_en_plus, optionEvent[+id].name)
                        .then(name => {
                        displayEmbedsMessage(result, new EmbedBuilder()
                            .setTitle("Evènement")
                            .setDescription("L'Evènement a été crée. il se nomme : " + name), true);
                    }).catch(err => {
                        throw err;
                    });
                })
                    .catch(err => {
                    throw err;
                });
                bot.ClearEvent();
            }
            catch (error) {
                if (error instanceof Error)
                    handleError(result, error, true);
            }
        }
    });
}
