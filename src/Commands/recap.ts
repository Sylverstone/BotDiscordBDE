import {
    SlashCommandStringOption,
    CommandInteraction,
    MessageFlags,
    EmbedBuilder,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType
} from "discord.js";
import {getValueFromDB, SaveValueToDB} from "../Fonctions/DbFunctions.js";
import "dotenv/config"
import CBot from "../Class/CBot.js";
import handleError from "../Fonctions/handleError.js";
import make_log from "../Fonctions/makeLog.js";
import displayEmbedsMessage from "../Fonctions/displayEmbedsMessage.js";
import {Reunion} from "../Enum/Reunion.js";

export const description = "Cette commande permet de recuperer les derniers récaps | set un récap";
export const name = "recap";

export const howToUse = "`/recap` vous permet de faire *2* choses.\nPremière utilisation : `/recap` en entrant cette commande Vous aurez le choix entre plusieurs date de récapitulatif. Les choix sont valables 100s.\nDeuxième utilisation : `/recap lien_recap` la commande sauvegarde le nouveau lien."
export const onlyGuild = true;

export const option = 
[
    new SlashCommandStringOption()
        .setName("lien_recap")
        .setDescription("Paramètre permettant de mettre un nouveau recap")
        .setRequired(false),
];

interface recap_t
{
    idRecap : number,
    lien_recap : string,
    text_entier : string | null,
    GuildId : string,
    date : Date
}

const isRecap_t = (value : unknown) : value is recap_t =>
{
    return value !== null && typeof value === "object" && "idRecap" in value
        && "lien_recap" in value && "text_entier" in value && "GuildId" in value;
}

const isRecap_tArray = (value : unknown) : value is recap_t[] =>
{
    return Array.isArray(value) && value.every(val => isRecap_t(val));
}

export const run = async(bot : CBot, message : CommandInteraction) => {
    try
    {        
        let haveParameters = false;
        haveParameters = message.options.data.length >= 1;
        
        if(haveParameters)
        {
            //saving value
            await message.deferReply({flags : MessageFlags.Ephemeral});
            SaveValueToDB(message,bot,"recapitulatif",undefined)
            .then(result => {
                make_log(true,message);
                displayEmbedsMessage(message, new EmbedBuilder()
                                                .setTitle("Information")
                                                .setDescription("Le changement a bien été fait :)"),true)
                return ;
            })
            .catch(err => {throw err});
        }  
        else
        {
            //getting values
            await message.deferReply();
            await getValueFromDB(message,"*","recapitulatif","idReunion",bot,"date")
                .then(async result => {
                    console.log(result);
                    if(!result)
                    {
                        await message.editReply("Il n'y a aucun récap actuellement :(");
                        return;
                    }
                    if(!isRecap_tArray(result)) return;
                    let listeRecap : {value : string, label : string,description : string}[] = [];

                    for(const recap of result)
                    {
                        if(!recap.date)
                            continue;
                        const day : string = recap.date.getDate() >= 11 ? `${recap.date.getDate()}` : `0${recap.date.getDate()}`;
                        const month : string = recap.date.getMonth() >= 9 ? `${recap.date.getMonth() + 1}` : `0${recap.date.getMonth() + 1}`;
                        const date : string = `${day}/${month}`;
                        listeRecap.push({label : date, value : recap.lien_recap, description : `Récapitulatif posté le ${date}`});
                    }

                    if(listeRecap.length <= 0)
                    {
                        await message.editReply("Il n'y a aucun récap valide :(");
                        return;
                    }
                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId(message.id)
                        .setPlaceholder("Choisissez une date de récap")
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setOptions(listeRecap.map(v => new StringSelectMenuOptionBuilder()
                            .setDescription(v.description)
                            .setValue(v.value)
                            .setLabel(v.label)))

                    const actionRow : ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
                    const response = await message.editReply({components : [actionRow]});

                    const collector = response.createMessageComponentCollector({
                        componentType : ComponentType.StringSelect,
                        time : 100_000
                    })

                    collector.on("end", async(interaction) =>   {
                        selectMenu.setPlaceholder("Out of time");
                        selectMenu.setDisabled(true);
                        await response.edit({components : [actionRow]});
                    })

                    collector.on("collect", async(interaction) => {
                        if(!interaction.values.length){
                            await interaction.reply("OK");
                            return;
                        }

                        if(interaction.values.length > 1)
                        {
                            await interaction.reply("HOW");
                            return;
                        }

                        interaction.reply("Le lien de ce récapitulatif est : " + interaction.values[0]);

                    })
                })
        }   
    }
    catch(error)
    {
        if(!(error instanceof Error)) return;
        handleError(message,error,true);
    }
}