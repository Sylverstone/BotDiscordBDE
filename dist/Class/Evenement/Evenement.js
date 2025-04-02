import date from "../Date/Date.js";
import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import testCo from "../../Database/testCo.js";
import createConnection from "../../Database/createConnection.js";
import splitNumber from "../../Fonctions/splitHeure.js";
export class CEvenement {
    constructor(name = "", dateDebut = "", dateFin = "", lieu = "", description = "", heureDebut = -1, heureFin = -1) {
        this.m_strName = "";
        this.m_dateDebut = new date("08-01-2006");
        this.m_dateFin = new date("08-01-2006");
        this.m_strLieu = "";
        this.m_strDescription = "";
        this.m_iHeureDebut = 6.9;
        this.m_iHeureFin = 6.9;
        this.name = name;
        if (dateDebut !== "")
            this.m_dateDebut = new date(dateDebut);
        if (dateFin !== "")
            this.m_dateFin = new date(dateFin);
        this.lieu = lieu;
        this.description = description;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
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
            description: `# Description\n${this.m_strDescription}`,
        });
        return this.m_strName;
    }
    async saveToDB(message, bot) {
        if (!message.guild)
            return;
        let commandSql = `INSERT INTO Event(lieu,info_en_plus,GuildId,name,datedebut,datefin,heuredebut,heurefin)
                                VALUES ('${this.lieu}','${this.description}',${message.guild.id},'${this.name}','${this.dateDebut}','${this.dateFin}',${this.heureDebut},${this.heureFin})`;
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
    setupHours(heureDebut, heureFin) {
        const [stringHeureDebutInt, stringHeureDebutDecimal] = splitNumber(heureDebut);
        const [stringHeureFintInt, stringHeureFinDecimal] = splitNumber(heureFin);
        this.dateDebut.setHours(+stringHeureDebutInt, +stringHeureDebutDecimal);
        this.dateFin.setHours(+stringHeureFintInt, +stringHeureFinDecimal);
    }
    // Getter and Setter for m_strName
    get name() {
        return this.m_strName;
    }
    set name(value) {
        this.m_strName = value;
    }
    // Getter and Setter for m_dateDebut
    get dateDebut() {
        return this.m_dateDebut;
    }
    //Renvoie InvalidDateError quand la date n'est pas un bon format
    set dateDebut(value) {
        this.m_dateDebut = new date(value);
    }
    // Getter and Setter for m_dateFin
    get dateFin() {
        return this.m_dateFin;
    }
    //Renvoie InvalidDateError quand la date n'est pas un bon format
    set dateFin(value) {
        this.m_dateFin = new date(value);
    }
    // Getter and Setter for m_strLieu
    get lieu() {
        return this.m_strLieu;
    }
    set lieu(value) {
        this.m_strLieu = value;
    }
    // Getter and Setter for m_strDescription
    get description() {
        return this.m_strDescription;
    }
    set description(value) {
        this.m_strDescription = value;
    }
    // Getter and Setter for m_iHeureDebut
    get heureDebut() {
        return this.m_iHeureDebut;
    }
    set heureDebut(value) {
        this.m_iHeureDebut = value;
    }
    // Getter and Setter for m_iHeureFin
    get heureFin() {
        return this.m_iHeureFin;
    }
    set heureFin(value) {
        this.m_iHeureFin = value;
    }
}
