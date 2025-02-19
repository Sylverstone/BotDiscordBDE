import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
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
                GatewayIntentBits.GuildModeration
            ],
            partials: [Partials.Channel],
        });
        this.commands = new Collection();
        this.bd = connection;
    }
}
