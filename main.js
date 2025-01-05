import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import loadCommands from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js"
import dotenv from "dotenv"
dotenv.config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
    ],
    partials : [Partials.Channel]
})


bot.once(Events.ClientReady, bot => {
    console.log(bot.user.tag)
    loadCommands(bot);
    loadEvenements(bot);
})


bot.login(process.env.TOKEN);


