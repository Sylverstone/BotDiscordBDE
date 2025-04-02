import { CEvenement } from "./Evenement.js";
import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import testCo from "../../Database/testCo.js";
import createConnection from "../../Database/createConnection.js";
export class CReunion extends CEvenement {
    constructor(name = "", dateDebut = "", dateFin = "", lieu = "", description = "", heureDebut = -1, heureFin = -1, sujet = "") {
        super(name, dateDebut, dateFin, lieu, description, heureDebut, heureFin);
        this.m_strSujet = "";
        this.m_strSujet = sujet;
    }
    async publish(message) {
        if (!message.guild)
            return;
        await message.guild.scheduledEvents.create({
            name: this.m_strName,
            scheduledStartTime: this.m_dateDebut.toDate(),
            scheduledEndTime: this.m_dateFin.toDate(),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            entityMetadata: {
                location: this.m_strLieu,
            },
            description: `Sujet : ${this.sujet}\nInformations en plus : ${this.m_strDescription}`,
        });
        return this.m_strName;
    }
    async saveToDB(message, bot) {
        if (!message.guild)
            return;
        let commandSql = `INSERT INTO Reunion(GuildId,sujet,lieu,info_en_plus,date,heuredebut,heurefin,reunion_name)
                                VALUES (${message.guild.id},'${this.sujet}','${this.lieu}','${this.description}','${this.dateDebut}',${this.heureDebut},${this.heureFin},'${this.name}')`;
        if (!testCo(bot.bd)) {
            bot.bd = createConnection();
        }
        return new Promise(function (resolve, reject) {
            bot.bd.query(commandSql, (err, values) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
    get sujet() {
        return this.m_strSujet;
    }
    set sujet(value) {
        this.m_strSujet = value;
    }
}
