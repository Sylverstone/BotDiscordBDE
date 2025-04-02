import {
    ActionRowBuilder, ButtonInteraction,
    CommandInteraction,
    EmbedBuilder, MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle,

} from "discord.js";

import { verifLogicDateWithoutHour} from "../../Fonctions/DateScript.js";
import displayEmbedsMessage from "../../Fonctions/displayEmbedsMessage.js";
import CBot from "../../Class/CBot.js";
import handleError from "../../Fonctions/handleError.js";
import {Color} from "../../Enum/Color.js";
import {sendButton} from "../../Fonctions/sendButton.js";
import {customId} from "../../Enum/customId.js";
import {getLieuField} from "../../Fonctions/Fields/getLieuField.js";
import {getHeureDebutField} from "../../Fonctions/Fields/getHeureDebutField.js";
import {getHeureFinField} from "../../Fonctions/Fields/getHeureFinField.js";
import {getDescriptionField} from "../../Fonctions/Fields/getDescriptionField.js";
import {getCustomField} from "../../Fonctions/Fields/getCustomField.js";
import {InvalidDateError} from "../../Class/Errors/InvalidDate.js";

export default async function saveEvent(message : CommandInteraction | ButtonInteraction, bot : CBot, phase = 1)
{
    try
    {
        console.log(phase);
        console.log("create event")

        const popup = new ModalBuilder({
            customId : "CreateEvent1",
            title : "Créer votre évènement (" + phase + "/2)",
        })

        //Nom
        const eventNameActionRow : ActionRowBuilder<TextInputBuilder> = getCustomField("eventName","Nom",TextInputStyle.Short,true,"Rentrez le nom de votre super évènement");

        //date de début
        const dateDebutFieldActionRow : ActionRowBuilder<TextInputBuilder> = getCustomField("dateDebut","Date de début",TextInputStyle.Short,true,"Format : jj-mm-aaaa où jj/mm/aaaa");

        //Date de fin
        const dateFinFieldActionRow : ActionRowBuilder<TextInputBuilder> = getCustomField("dateFin","Date de fin",TextInputStyle.Short,true,"Format : jj-mm-aaaa où jj/mm/aaaa");

        //lieu. customId : lieu
        const lieuFieldActionRow = getLieuField()

        //heure de début. customId : heureDebut
        const heureDebutFieldActionRow = getHeureDebutField();

        //heure de fin
        const heureFinFieldActionRow : ActionRowBuilder<TextInputBuilder> = getHeureFinField();

        //info en plus
        const additionalInfoFieldActionRow : ActionRowBuilder<TextInputBuilder> = getDescriptionField();

        if(phase === 1)
        {
            popup.addComponents(eventNameActionRow)
                .addComponents(lieuFieldActionRow)
                .addComponents(dateDebutFieldActionRow)
                .addComponents(dateFinFieldActionRow)

        }
        else{
            popup.addComponents(heureDebutFieldActionRow)
                .addComponents(heureFinFieldActionRow)
                .addComponents(additionalInfoFieldActionRow)
        }


        await message.showModal(popup)
        const filter = (interaction : ModalSubmitInteraction) => interaction.customId === "CreateEvent1";
        let mess2 : ModalSubmitInteraction;

        message.awaitModalSubmit({filter, time : 300_000_000})
            .then(async result => {
                mess2 = result;
                if(!result.guild) return;
                const id = result.guild.id;
                if(phase === 1)
                {
                    bot.eventData[+id].name = result.fields.getTextInputValue("eventName");
                    bot.eventData[+id].dateDebut = result.fields.getTextInputValue("dateDebut");
                    bot.eventData[+id].dateFin = result.fields.getTextInputValue("dateFin");
                    const EventList = await result.guild.scheduledEvents.fetch();
                    if (typeof EventList.find(event => event.name === bot.eventData[+id].name) !== "undefined") {
                        await displayEmbedsMessage(result, new EmbedBuilder()
                            .setTitle("Erreur")
                            .setColor(Color.failureColor)
                            .setDescription("Un évènement avec le même nom existe déjà.C'est interdit"));
                        return;
                    }
                    const datedebut = bot.eventData[+id].dateDebut
                    const datefin = bot.eventData[+id].dateFin;
                    if(!verifLogicDateWithoutHour(datedebut, datefin)){
                        await displayEmbedsMessage(result, new EmbedBuilder()
                            .setColor(Color.failureColor)
                            .setDescription("La date n'est pas bonne.\nRaison possible :\n-Définition dans le passé\n-date de fin > date début")
                            .setTitle("Erreur"));
                        return;
                    }
                    bot.eventData[+id].lieu = result.fields.getTextInputValue("lieu");
                    await sendButton("Continuer le formulaire",result,customId.event,bot);
                }
                else {
                    await result.deferReply({flags: MessageFlags.Ephemeral});
                    bot.eventData[+id].description = result.fields.getTextInputValue("info_en_plus");

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
                    bot.eventData[+id].heureDebut = parseFloat(heureDebut);
                    bot.eventData[+id].heureFin  = parseFloat(heureFin);
                    const optionEvent = bot.eventData;
                    bot.eventData[+id].setupHours(optionEvent[+id].heureDebut,optionEvent[+id].heureFin);

                    await bot.eventData[+id].publish(message)
                        .then( async() =>
                        {
                            await displayEmbedsMessage(result, new EmbedBuilder()
                                .setTitle("Reunion")
                                .setDescription("L'évènement a été crée. il se nomme : " + bot.eventData[+id].name)
                                .setColor(Color.successColor),true);

                            await bot.eventData[+id].saveToDB(message,bot);
                            bot.ClearEvent(+id);
                        })
                        .catch( (e) => {
                            throw e
                        })
                }
            })
            .catch( async(e) => {
                if(e instanceof InvalidDateError) {
                    await displayEmbedsMessage(mess2, new EmbedBuilder()
                        .setColor(Color.failureColor)
                        .setDescription("Les dates ne sont pas bonnes")
                        .setTitle("Erreur")
                    );
                    return;
                }
            })
    }
    catch(e)
    {
        if(e instanceof Error && message instanceof CommandInteraction)
            handleError(message,e)
    }

}