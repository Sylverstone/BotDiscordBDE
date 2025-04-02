import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { CEvenement } from "./Evenement/Evenement.js";
import { CReunion } from "./Evenement/Reunion.js";
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
        this.eventData[guildId] = new CEvenement();
        return this.eventData;
    }
    setDefaultReunionDataGuild(guildId) {
        this.reunionData[guildId] = new CReunion();
        return this.reunionData;
    }
    ClearEvent(id) {
        this.setDefaultEventDataGuild(id);
    }
    clearReunion(id) {
        this.setDefaultReunionDataGuild(id);
    }
}
