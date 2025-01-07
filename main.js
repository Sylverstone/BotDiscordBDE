import { ActivityType, Client, Collection, Events, GatewayIntentBits, Partials} from "discord.js";
import loadCommands from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js"
import dotenv from "dotenv"
import { type } from "os";
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

bot.commands = new Collection();

bot.once(Events.ClientReady, bot => {
    console.log("bot",bot.user.tag,"is online :)");
    bot.user.setUsername("Yoichi")
    bot.user.setPresence({activities : [{name : "Vinland Saga" , type : ActivityType.Watching}], status : "dnd"});
    loadCommands(bot);
    loadEvenements(bot);
})


bot.login(process.env.TOKEN);


