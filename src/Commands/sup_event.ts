import {
    ActionRowBuilder,
    CommandInteraction,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ComponentType, MessageFlags, EmbedBuilder
} from "discord.js";

import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import 'dotenv/config'
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import {Color} from "../Enum/Color.js";


export const description = "Cette commande vous permet de supprimer un évènement grâce a son nom";
export const name = "sup_event";
export const howToUse = "`/sup_event 'nom_reunion'` vous permet de supprimer un evènement grâce a son nom"

/*
export const option = [
    new SlashCommandStringOption()
    .setName("nom_reunion")
    .setDescription("le nom de la reunion")    
    .setRequired(true)
];
*/

export const onlyGuild = true;

interface eventData
{
    label : string,
    value : string,
    description? : string,
    emoji? : string
}

export const  run = async(bot : CBot, message : CommandInteraction) => {
    try 
    {
        const guild = message.guild;
        if(!guild)
        {
            throw new Error("Guild inexistante");
        }
        const events = await guild.scheduledEvents.fetch();
        let eventList : eventData[] = [];
        events.forEach((e) => {
            const data : eventData =
            {
                label : e.name,
                value : e.name,
            }
            if(e.description)
                data.description = e.description;
            eventList.push(data);
        })

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(message.id)
            .setPlaceholder("Choisissez l'évènement")
            .setMinValues(0)
            .setMaxValues(eventList.length)
            .addOptions(eventList.map((eventData) => new StringSelectMenuOptionBuilder()
                                                                                    .setLabel(eventData.label)
                                                                                    .setDescription(eventData.description !== undefined ? eventData.description : "")
                                                                                    .setValue(eventData.value)
            ))

        const actionRow : ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
        if(!message.isChatInputCommand()) return;

        const reply = await message.reply({components : [actionRow]});


        //Recuperer la réponse de l'utilisateur quand il a validé sa saisie
        const collector = reply.createMessageComponentCollector({
            componentType : ComponentType.StringSelect,
            filter : (i) => i.user.id === message.user.id && i.customId === message.id,
            time: 60_000
        })

        collector.on("collect",async(interaction) => {

            await interaction.deferReply({flags : MessageFlags.Ephemeral});
            const length : number = interaction.values.length;
            if(!length)
            {
                interaction.editReply("OK");
            }
            else
            {
                for (const eventName of interaction.values) {
                    const events = await guild.scheduledEvents.fetch();
                    const cibleEvent = events.find((e) => e.name === eventName);
                    if(cibleEvent)
                        await cibleEvent.delete();
                }

                let phrase : string = length > 0 ? "Les évènements : " : "L'évènement :";
                for(let i = 0; i <interaction.values.length - 1; i++)
                {
                    phrase += interaction.values[i] + ", ";
                }
                phrase += interaction.values[interaction.values.length - 1];
                phrase += length > 0 ? " ont été supprimés" : " a été supprimé";
                await displayEmbedsMessage(interaction, new EmbedBuilder()
                    .setTitle("Reussite")
                    .setDescription(phrase)
                    .setColor(Color.successColor),true);
            }

        })
    }
    catch(Err)
    {
        if(Err instanceof Error)
        {
            handleError(message,Err,true);
        }
        
    }
}
