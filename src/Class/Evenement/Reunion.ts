import {CEvenement} from "./Evenement.js";
import {
    ButtonInteraction,
    CommandInteraction,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    ModalSubmitInteraction
} from "discord.js";
import CBot from "../CBot.js";
import testCo from "../../Database/testCo.js";
import createConnection from "../../Database/createConnection.js";

export class CReunion extends CEvenement
{
    private m_strSujet = "";

    constructor(name : string = "", dateDebut : string = "", dateFin : string = "", lieu = "", description = "",heureDebut = -1, heureFin = -1,sujet : string = ""){
        super(name,dateDebut,dateFin,lieu,description,heureDebut,heureFin);
        this.m_strSujet = sujet;
    }

    public override  async publish(message : CommandInteraction | ModalSubmitInteraction | ButtonInteraction) : Promise<string | undefined>
    {
        if(!message.guild) return;
        await message.guild.scheduledEvents.create({
            name : this.m_strName,
            scheduledStartTime : this.m_dateDebut.toDate(),
            scheduledEndTime : this.m_dateFin.toDate(),

            privacyLevel :GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType : GuildScheduledEventEntityType.External,
            entityMetadata : {
                location : this.m_strLieu,
            },
            description : `Sujet : ${this.sujet}\nInformations en plus : ${this.m_strDescription}`,
        })

        return this.m_strName;
    }

    public override async saveToDB(message : CommandInteraction | ModalSubmitInteraction | ButtonInteraction,bot : CBot)
    {
        if(!message.guild) return;
        let commandSql = `INSERT INTO Reunion(GuildId,sujet,lieu,info_en_plus,date,heuredebut,heurefin,reunion_name)
                                VALUES (${message.guild.id},'${this.sujet}','${this.lieu}','${this.description}','${this.dateDebut}',${this.heureDebut},${this.heureFin},'${this.name}')`;
        if(!testCo(bot.bd))
        {
            bot.bd = createConnection();
        }
        return new Promise(function(resolve, reject){
            bot.bd.query(commandSql, (err,values) => {
                    if(err)
                    {
                        reject(err);
                        return;
                    }
                    resolve(true);
                }
            )
        })
    }

    public get sujet()
    {
        return this.m_strSujet;
    }
    public set sujet(value : string)
    {
        this.m_strSujet = value;
    }
}