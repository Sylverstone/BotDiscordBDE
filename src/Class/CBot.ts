import {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    SlashCommandStringOption,
    SlashCommandIntegerOption,
    SlashCommandUserOption,
    SlashCommandNumberOption,
    SlashCommandBooleanOption,
    ModalSubmitInteraction,
    ButtonInteraction,
    Message,
    CommandInteraction,
    Events,
    Guild,
    GuildScheduledEvent
} from "discord.js"
import { Connection,  } from "mysql2/typings/mysql/lib/Connection";
import {Evenement_t} from "../Commands/Event/event";
import {reunion_t} from "../Commands/Reunion/reunion";

export interface commands_t{
    [key: string]: any;
}

//Type représentant l'import d'un script commande
export type script_t = 
{
    name : string;
    description : string;
    howToUse : string;
    run : (bot : CBot, interaction : Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction, args : string[]) => any;
    onlyGuild : boolean;
    option? : SlashCommandStringOption[];
    optionInt? : SlashCommandIntegerOption[] ;
    optionUser? : SlashCommandUserOption[] ;
    optionNum? : SlashCommandNumberOption[] ;
    optionBoolean? : SlashCommandBooleanOption[] ;
}

export type interaction_t = CommandInteraction | Message | Guild | GuildScheduledEvent | ModalSubmitInteraction | ButtonInteraction;

export type scriptEvent_t =
{
    name : Events,
    exec : (bot : CBot, interaction : interaction_t) => any;
}
//Renvoie true si le paramètre est un script_t
export const isScript_t = (script : unknown) : script is script_t =>
{
    return script !== null && typeof script === "object"  && "name" in script && "description" in script
            && "howToUse" in script && "run" in script && "onlyGuild" in script;
}

export interface reunionData_t
{
    [key : number]: reunion_t;
}

export interface eventData_t
{
    [key : number]: Evenement_t;
}
export default class CBot extends Client{

    public commands : Collection<string,script_t>;
    public bd : Connection;
    public eventData : eventData_t;
    public reunionData : reunionData_t;
    constructor(connection : Connection){
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildScheduledEvents
            ],
            partials : [Partials.Channel],
        })

        this.commands = new Collection();
        this.bd = connection;
        this.eventData = {};
        this.reunionData = {};
    }

    public setDefaultEventDataGuild(guildId : number) : eventData_t {
        this.eventData[guildId] = {
            info_en_plus :"",
            lieu : "",
            datedebut : "",
            datefin  : "",
            heuredebut  : 0,
            heurefin  : 0,
            name  : ""
        }
        return this.eventData
    }

    public setDefaultReunionDataGuild(guildId : number) : reunionData_t {
        this.reunionData[guildId] = {
            info_en_plus :"",
            lieu : "",
            date : "",
            sujet : "",
            heuredebut  : 0,
            heurefin  : 0,
            reunion_name  : ""
        }
        return this.reunionData
    }

    public ClearEvent(id : number)
    {
        this.setDefaultEventDataGuild(id);
    }

    public clearReunion(id : number)
    {
       this.setDefaultReunionDataGuild(id);
    }
}
