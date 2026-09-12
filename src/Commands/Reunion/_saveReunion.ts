import {
    ActionRowBuilder,
    ButtonInteraction,
    CommandInteraction,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import CBot from "../../Class/CBot.js";
import { verifLogicDate, verifLogicDateWithoutHour} from "../../Fonctions/DateScript.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import handleError from "../../Fonctions/handleError.js";
import {Color} from "../../Enum/Color.js";
import {sendButton} from "../../Fonctions/sendButton.js";
import {customId} from "../../Enum/customId.js";
import {getHeureDebutField} from "../../Fonctions/Fields/getHeureDebutField.js";
import {getLieuField} from "../../Fonctions/Fields/getLieuField.js";
import {getHeureFinField} from "../../Fonctions/Fields/getHeureFinField.js";
import {getDescriptionField} from "../../Fonctions/Fields/getDescriptionField.js";
import {getCustomField} from "../../Fonctions/Fields/getCustomField.js";
import {InvalidDateError} from "../../Class/Errors/InvalidDate.js";


export default async function saveReunion(message : CommandInteraction | ButtonInteraction, bot : CBot, phase = 1)
{

    if(!message.guild) return;
    console.log(phase);
    console.log("create reunion")

    const popup = new ModalBuilder({
        customId : "CreateReunion1",
        title : "Créer votre Reunion (" + phase + "/2)",
    })

    //Nom
    const sujetFieldActionRow : ActionRowBuilder<TextInputBuilder> = getCustomField("sujetField","Sujet",TextInputStyle.Short,true,"C'est quoi le sujet de cette réunion ?");
   
    //date de début
    const dateFieldActionRow : ActionRowBuilder<TextInputBuilder> = getCustomField("dateField","Date",TextInputStyle.Short,true,"Format : jj-mm-aaaa ou jj/mm/aaaa");

    const lieuFieldActionRow = getLieuField()

    //heure de début. customId : heureDebut
    const heureDebutFieldActionRow = getHeureDebutField();

    //heure de fin
    const heureFinFieldActionRow : ActionRowBuilder<TextInputBuilder> = getHeureFinField();

    //info en plus
    const additionalInfoFieldActionRow : ActionRowBuilder<TextInputBuilder> = getDescriptionField();
    if(phase === 1)
    {
        popup.addComponents(sujetFieldActionRow)
            .addComponents(lieuFieldActionRow)
            .addComponents(dateFieldActionRow)
    }
    else{
        popup.addComponents(heureDebutFieldActionRow)
            .addComponents(heureFinFieldActionRow)
            .addComponents(additionalInfoFieldActionRow)
    }

    await message.showModal(popup)
    const filter = (interaction : ModalSubmitInteraction) => interaction.customId === "CreateReunion1";
    let mess2 : ModalSubmitInteraction;
    try {
        message.awaitModalSubmit({filter, time : 300_000_000})
            .then(async result => {
                mess2 = result;
                if(!result.guild) return;
                const id = result.guild.id;
                    if(phase === 1)
                    {
                        try {
                            bot.reunionData[+id].sujet = result.fields.getTextInputValue("sujetField");
                            bot.reunionData[+id].dateDebut = result.fields.getTextInputValue("dateField");
                            bot.reunionData[+id].dateFin = result.fields.getTextInputValue("dateField");
                            //Verification de la date
                            const datedebut = bot.reunionData[+id].dateDebut
                            const datefin = bot.reunionData[+id].dateFin;
                            if(!verifLogicDateWithoutHour(datedebut, datefin)){
                                await displayEmbedsMessage(result, new EmbedBuilder()
                                    .setColor(Color.failureColor)
                                    .setDescription("La date n'est pas bonne.\nRaison possible : Définition dans le passé")
                                    .setTitle("Erreur"));
                                return;
                            }
                            let name = `Reunion ${datedebut.getDay()}/${datedebut.getMonth()}`;
                            let EventList = await result.guild.scheduledEvents.fetch();
                            EventList = EventList.filter(event => event.name.startsWith(name));
                            if(EventList.size > 0)
                            {
                                name = `Reunion ${datedebut.getDay()}/${datedebut.getMonth()} (${EventList.size})`;
                            }
                            bot.reunionData[+id].name = name;
                            bot.reunionData[+id].lieu = result.fields.getTextInputValue("lieu");
                            await sendButton("Continuer le formulaire",result,customId.reunion,bot);
                        }
                        catch (e)
                        {
                            if(e instanceof Error)
                            {
                                console.log(e);
                                handleError(result,e)
                            }
                        }
                    }
                    else {
                        try {
                            await result.deferReply({flags: MessageFlags.Ephemeral});
                            bot.reunionData[+id].description = result.fields.getTextInputValue("info_en_plus");

                        const heureDebut: string = result.fields.getTextInputValue("heureDebut");
                        const heureFin: string = result.fields.getTextInputValue("heureFin");
                        if (isNaN(parseFloat(heureDebut)) || isNaN(parseFloat(heureFin))) {
                            await displayEmbedsMessage(result, new EmbedBuilder()
                                    .setColor(Color.failureColor)
                                    .setDescription("Les heures ne sont pas bonnes")
                                    .setTitle("Erreur")
                                , true);
                            return;
                        }
                        bot.reunionData[+id].heureDebut = parseFloat(heureDebut);
                        bot.reunionData[+id].heureFin = parseFloat(heureFin);
                        const optionReunion = bot.reunionData;

                        //règle les heures des dates
                        bot.reunionData[+id].setupHours(optionReunion[+id].heureDebut,optionReunion[+id].heureFin);
                        const dateDebut = optionReunion[+id].dateDebut;
                        if(!verifLogicDate(dateDebut, dateDebut)){
                            await displayEmbedsMessage(result, new EmbedBuilder()
                                .setColor(Color.failureColor)
                                .setDescription("La date n'est pas bonne.\nRaison possible : Définition dans le passé")
                                .setTitle("Erreur"),true);
                            return;
                        }
                        bot.reunionData[+id].publish(message)
                        .then( async() =>
                        {
                            await displayEmbedsMessage(result, new EmbedBuilder()
                                .setTitle("Reunion")
                                .setDescription("La reunion a été crée. Elle se nomme : " + bot.reunionData[+id].name)
                                .setColor(Color.successColor),true);

                            await bot.reunionData[+id].saveToDB(message,bot);
                            bot.clearReunion(+id);
                        })
                        .catch( (e) => {
                            throw e
                        })
                    }
                    catch(error)
                    {
                        console.log(error);
                        if(error instanceof  Error)
                            handleError(result,error,true);
                    }
                }

            })
            .catch( async(e) => {
                if(e instanceof InvalidDateError)
                {
                    await displayEmbedsMessage(mess2, new EmbedBuilder()
                        .setColor(Color.failureColor)
                        .setDescription("Les dates ne sont pas bonnes")
                        .setTitle("Erreur")
                    );
                    return;
                }
                else
                    throw e;
            })
    }
    catch (e)
    {
        if(e instanceof Error && message instanceof CommandInteraction)
            handleError(message,e)
    }

}