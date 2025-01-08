import { ActivityType, Client, Collection, Events, GatewayIntentBits, Partials} from "discord.js";
import loadCommands from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js"
import dotenv from "dotenv"
import { connection } from "./Database/coDatabase.js";
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

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

connection.query("SELECT * FROM utilisateurs", (err, results) => {
    if(!err)
    {
        console.log(results)
    }
})
bot.once(Events.ClientReady, bot => {
    console.log("bot",bot.user.tag,"is online :)");
    
    bot.user.setUsername("Yoichi")
    bot.user.setPresence({activities : [{name : "Vinland Saga" , type : ActivityType.Watching}], status : "dnd"});
    loadCommands(bot);
    loadEvenements(bot);
})


bot.login(process.env.TOKEN);


