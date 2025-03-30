import { EmbedBuilder, MessageFlags, ModalBuilder, TextInputStyle } from "discord.js";
import CreateEvent from "../../Fonctions/CreateEvent.js";
import { createDate, setup_date, verifLogicDate, verifLogicDateWithoutHour } from "../../Fonctions/DateScript.js";
import { SaveValueToDB } from "../../Fonctions/DbFunctions.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import handleError from "../../Fonctions/handleError.js";
import { Color } from "../../Enum/Color.js";
import { sendButton } from "../../Fonctions/sendButton.js";
import { getHeureDebutField } from "../../Fonctions/Fields/getHeureDebutField.js";
import { getLieuField } from "../../Fonctions/Fields/getLieuField.js";
import { getHeureFinField } from "../../Fonctions/Fields/getHeureFinField.js";
import { getDescriptionField } from "../../Fonctions/Fields/getDescriptionField.js";
import { getCustomField } from "../../Fonctions/Fields/getCustomField.js";
export default async function saveReunion(message, bot, phase = 1) {
    /*
    if(!message.guild) throw new Error("Aucune guild n'est dispo");
    if(!("info_en_plus" in optionObject))
    {
        optionObject["info_en_plus"] = "Pas d'informations en plus"
    }
    if(!isReunion(optionObject)) return message.editReply("La définition de la réunion n'est pas complète :(");
8
    const optionReunion : reunion_t = optionObject;
    const dateActu = new date();
    if(!(typeof optionReunion.date === "string")) throw new Error("OptionReunion.date must be a string");
    //date est un string
    const dateDebut = createDate(optionReunion.date);
    
    const [stringIntegerPart,stringDecimalPart] = splitNumber(optionReunion.heuredebut);
    const [stringIntegerPartFin, stringDecimalPartFin] = splitNumber(optionReunion.heurefin);
    const dateFin = createDate(optionReunion.date);
    if(!(dateFin instanceof date && dateDebut instanceof date)) throw Error("Erreur de développement, DateFIn et dateDebut ne sont pas de type Date") ;
    dateDebut.setHours(+stringIntegerPart,stringDecimalPart);
    dateFin.setHours(+stringIntegerPartFin,stringDecimalPartFin);
    if(dateActu.getTime() > dateDebut.getTime()) return message.editReply("La reunion ne peut pas être défini dans le passé");
    //le changement de séparateur est obligatoire
    optionReunion.date = optionReunion.date.replace("/","-").replace("/","-");
    let name = `Reunion ${dateDebut.getDay()}/${dateDebut.getMonth()}`;
    let EventList = await message.guild.scheduledEvents.fetch();
    EventList = EventList.filter(event => event.name.startsWith(name));
    if(EventList.size > 0)
    {
        name = `Reunion ${dateDebut.getDay()}/${dateDebut.getMonth()} (${EventList.size})`;
    }
    const finalObjectEvent = {
        date : dateDebut.toString(),
        sujet : optionReunion.sujet,
        lieu : optionReunion.lieu,
        info_en_plus : optionReunion.info_en_plus,
        heuredebut : optionReunion.heuredebut,
        heurefin : optionReunion.heurefin ,
        reunion_name : name
    };

    SaveValueToDB(message,bot,"Reunion",finalObjectEvent)
    .then(async result => {
        const sujet = optionReunion.sujet;
        const lieu = optionReunion.lieu;
        const info_en_plus = optionReunion.info_en_plus;
        const res  = await getLastId("Reunion","idReunion",bot);
        if(!isMaxId(res)) throw new Error("res n'est pas la valeur attendu");
        const id = res.maxId;
        CreateEvent(message,sujet,dateDebut,dateFin,lieu,info_en_plus,id,finalObjectEvent.reunion_name)
        .then(async(name) => {
            await displayEmbedsMessage(message, new EmbedBuilder()
                                    .setTitle("Reunion")
                                    .setDescription("La reunion a été crée. Elle se nomme : " + name),true);
        })
        .catch(async(err) => {
            await displayEmbedsMessage(message, new EmbedBuilder()
                                    .setTitle("Information")
                                    .setDescription("Une erreur a eu lieu :("),true);
        });
    })
    .catch(err => {
        throw err;
    });

     */
    if (!message.guild)
        return;
    console.log(phase);
    console.log("create reunion");
    const popup = new ModalBuilder({
        customId: "CreateReunion1",
        title: "Créer votre Reunion (" + phase + "/2)",
    });
    //Nom
    const sujetFieldActionRow = getCustomField("sujetField", "Sujet", TextInputStyle.Short, true, "C'est quoi le sujet de cette réunion ?");
    //date de début
    const dateFieldActionRow = getCustomField("dateField", "Date", TextInputStyle.Short, true, "Format : jj-mm-aaaa ou jj/mm/aaaa");
    const lieuFieldActionRow = getLieuField();
    //heure de début. customId : heureDebut
    const heureDebutFieldActionRow = getHeureDebutField();
    //heure de fin
    const heureFinFieldActionRow = getHeureFinField();
    //info en plus
    const additionalInfoFieldActionRow = getDescriptionField();
    if (phase === 1) {
        popup.addComponents(sujetFieldActionRow)
            .addComponents(lieuFieldActionRow)
            .addComponents(dateFieldActionRow);
    }
    else {
        popup.addComponents(heureDebutFieldActionRow)
            .addComponents(heureFinFieldActionRow)
            .addComponents(additionalInfoFieldActionRow);
    }
    await message.showModal(popup);
    const filter = (interaction) => interaction.customId === "CreateReunion1";
    try {
        message.awaitModalSubmit({ filter, time: 30000000 })
            .then(async (result) => {
            if (!result.guild)
                return;
            const id = result.guild.id;
            if (phase === 1) {
                try {
                    bot.reunionData[+id].sujet = result.fields.getTextInputValue("sujetField");
                    bot.reunionData[+id].date = result.fields.getTextInputValue("dateField");
                    //la date de l'évènement, sert pour verifier sa conformité
                    const tdate = bot.reunionData[+id].date;
                    if (!(typeof tdate === "string"))
                        return;
                    const tDate1 = createDate(tdate);
                    if (tDate1 === undefined) {
                        await displayEmbedsMessage(result, new EmbedBuilder()
                            .setColor(Color.failureColor)
                            .setDescription("La date n'est pas bonnes")
                            .setTitle("Erreur de saisie"));
                        return;
                    }
                    //Verification de la date
                    if (!verifLogicDateWithoutHour(tDate1, tDate1)) {
                        await displayEmbedsMessage(result, new EmbedBuilder()
                            .setColor(Color.failureColor)
                            .setDescription("La date n'est pas bonne.\nRaison possible : Définition dans le passé")
                            .setTitle("Erreur"));
                        return;
                    }
                    let name = `Reunion ${tDate1.getDay()}/${tDate1.getMonth()}`;
                    let EventList = await result.guild.scheduledEvents.fetch();
                    EventList = EventList.filter(event => event.name.startsWith(name));
                    if (EventList.size > 0) {
                        name = `Reunion ${tDate1.getDay()}/${tDate1.getMonth()} (${EventList.size})`;
                    }
                    bot.reunionData[+id].reunion_name = name;
                    bot.reunionData[+id].lieu = result.fields.getTextInputValue("lieu");
                    await sendButton(result, "+reunion" /* customId.reunion */);
                }
                catch (e) {
                    if (e instanceof Error) {
                        console.log(e);
                        handleError(result, e);
                    }
                }
            }
            else {
                try {
                    await result.deferReply({ flags: MessageFlags.Ephemeral });
                    bot.reunionData[+id].info_en_plus = result.fields.getTextInputValue("info_en_plus");
                    const heureDebut = result.fields.getTextInputValue("heureDebut");
                    const heureFin = result.fields.getTextInputValue("heureFin");
                    if (isNaN(parseFloat(heureDebut)) || isNaN(parseFloat(heureFin))) {
                        await displayEmbedsMessage(result, new EmbedBuilder()
                            .setColor(Color.failureColor)
                            .setDescription("Les heures ne sont pas bonnes")
                            .setTitle("Erreur"), true);
                        return;
                    }
                    bot.reunionData[+id].heuredebut = parseFloat(heureDebut);
                    bot.reunionData[+id].heurefin = parseFloat(heureFin);
                    console.table(bot.reunionData);
                    const optionReunion = bot.reunionData;
                    if (!(typeof optionReunion[+id].date === "string"))
                        return;
                    //Contient la date de fin et de début
                    const tdateDebut = optionReunion[+id].date;
                    if (!(typeof tdateDebut === "string"))
                        return;
                    const DateCreation = setup_date(tdateDebut, tdateDebut, optionReunion[+id].heuredebut, optionReunion[+id].heurefin, result);
                    if (!DateCreation)
                        return;
                    const dateDebut = DateCreation[0];
                    const dateFin = DateCreation[1];
                    if (!verifLogicDate(dateDebut, dateDebut)) {
                        await displayEmbedsMessage(result, new EmbedBuilder()
                            .setColor(Color.failureColor)
                            .setDescription("La date n'est pas bonne.\nRaison possible : Définition dans le passé")
                            .setTitle("Erreur"), true);
                        return;
                    }
                    const finalObjectEvent = {
                        date: dateDebut.toString(),
                        sujet: optionReunion[+id].sujet,
                        lieu: optionReunion[+id].lieu,
                        info_en_plus: optionReunion[+id].info_en_plus,
                        heuredebut: optionReunion[+id].heuredebut,
                        heurefin: optionReunion[+id].heurefin,
                        reunion_name: optionReunion[+id].reunion_name,
                    };
                    SaveValueToDB(result, bot, "Reunion", finalObjectEvent)
                        .then(async () => {
                        const sujet = optionReunion[+id].sujet;
                        const lieu = optionReunion[+id].lieu;
                        const info_en_plus = optionReunion[+id].info_en_plus;
                        CreateEvent(result, sujet, dateDebut, dateFin, lieu, info_en_plus, finalObjectEvent.reunion_name)
                            .then(async (name) => {
                            await displayEmbedsMessage(result, new EmbedBuilder()
                                .setTitle("Reunion")
                                .setDescription("La reunion a été crée. Elle se nomme : " + name)
                                .setColor(Color.successColor), true);
                        })
                            .catch(async (e) => {
                            console.log(e);
                            await displayEmbedsMessage(result, new EmbedBuilder()
                                .setTitle("Information")
                                .setDescription("Une erreur a eu lieu :(")
                                .setColor(Color.failureColor), true);
                        });
                    })
                        .catch(err => {
                        throw err;
                    });
                    bot.clearReunion(+id);
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof Error)
                        handleError(result, error, true);
                }
            }
        });
    }
    catch (e) {
    }
}
