import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
//Renvoie true si le paramètre est un script_t
export const isScript_t = (script) => {
    return script !== null && typeof script === "object" && "name" in script && "description" in script
        && "howToUse" in script && "run" in script && "onlyGuild" in script;
};
export default class CBot extends Client {
    constructor(connection) {
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
            partials: [Partials.Channel],
        });
        this.commands = new Collection();
        this.bd = connection;
        this.eventData = {};
        this.reunionData = {};
    }
    setDefaultEventDataGuild(guildId) {
        this.eventData[guildId] = {
            info_en_plus: "",
            lieu: "",
            datedebut: "",
            datefin: "",
            heuredebut: 0,
            heurefin: 0,
            name: ""
        };
        return this.eventData;
    }
    setDefaultReunionDataGuild(guildId) {
        this.reunionData[guildId] = {
            info_en_plus: "",
            lieu: "",
            date: "",
            sujet: "",
            heuredebut: 0,
            heurefin: 0,
            reunion_name: ""
        };
        return this.reunionData;
    }
    ClearEvent() {
        this.eventData = {};
    }
    clearReunion() {
        this.reunionData = {
            0: {
                reunion_name: "",
                info_en_plus: "",
                date: "",
                heuredebut: 0,
                heurefin: 0,
                lieu: "",
                sujet: ""
            }
        };
    }
}
