import date from "../Date/Date.js";
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
import splitNumber from "../../Fonctions/splitHeure.js";

export class CEvenement
{
    protected m_strName = "";
    protected m_dateDebut = new date("08-01-2006");
    protected m_dateFin = new date("08-01-2006");
    protected m_strLieu : string = "";
    protected m_strDescription : string = "";
    protected m_iHeureDebut : number = 6.9;
    protected m_iHeureFin : number = 6.9;

    constructor(name : string = "", dateDebut : string = "", dateFin : string = "", lieu = "", description = "",heureDebut = -1, heureFin = -1){

        this.name = name;
        if(dateDebut !== "")
            this.m_dateDebut = new date(dateDebut);
        if(dateFin !== "")
            this.m_dateFin = new date(dateFin);
        this.lieu = lieu;
        this.description = description;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
    }

    public async publish(message : CommandInteraction | ModalSubmitInteraction | ButtonInteraction) : Promise<string | undefined>
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
            description : `# Description\n${this.m_strDescription}`,
        })

        return this.m_strName;
    }

    public async saveToDB(message : CommandInteraction | ModalSubmitInteraction | ButtonInteraction,bot : CBot)
    {

        if(!message.guild) return;
        let commandSql = `INSERT INTO Event(lieu,info_en_plus,GuildId,name,datedebut,datefin,heuredebut,heurefin)
                                VALUES ('${this.lieu}','${this.description}',${message.guild.id},'${this.name}','${this.dateDebut}','${this.dateFin}',${this.heureDebut},${this.heureFin})`;
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

    public setupHours(heureDebut : number, heureFin : number)
    {
        const [stringHeureDebutInt, stringHeureDebutDecimal] = splitNumber(heureDebut);
        const [stringHeureFintInt, stringHeureFinDecimal] = splitNumber(heureFin);
        this.dateDebut.setHours(+stringHeureDebutInt,+stringHeureDebutDecimal);
        this.dateFin.setHours(+stringHeureFintInt,+stringHeureFinDecimal);
    }

    // Getter and Setter for m_strName
    public get name(): string {
        return this.m_strName;
    }
    public set name(value: string) {
        this.m_strName = value;
    }

    // Getter and Setter for m_dateDebut
    public get dateDebut(): date {
        return this.m_dateDebut;
    }
    //Renvoie InvalidDateError quand la date n'est pas un bon format
    public set dateDebut(value: string) {
        this.m_dateDebut = new date(value);
    }

    // Getter and Setter for m_dateFin
    public get dateFin(): date {
        return this.m_dateFin;
    }
    //Renvoie InvalidDateError quand la date n'est pas un bon format
    public set dateFin(value: string) {
        this.m_dateFin = new date(value);
    }

    // Getter and Setter for m_strLieu
    public get lieu(): string {
        return this.m_strLieu;
    }
    public set lieu(value: string) {
        this.m_strLieu = value;
    }

    // Getter and Setter for m_strDescription
    public get description(): string {
        return this.m_strDescription;
    }
    public set description(value: string) {
        this.m_strDescription = value;
    }

    // Getter and Setter for m_iHeureDebut
    public get heureDebut(): number {
        return this.m_iHeureDebut;
    }
    public set heureDebut(value: number) {
        this.m_iHeureDebut = value;
    }

    // Getter and Setter for m_iHeureFin
    public get heureFin(): number {
        return this.m_iHeureFin;
    }
    public set heureFin(value: number) {
        this.m_iHeureFin = value;
    }
}