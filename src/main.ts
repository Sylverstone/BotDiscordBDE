import { ActivityType, Events} from "discord.js";
import {loadCommandsOnAllServers} from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js"
import "dotenv/config";
import { connection } from "./Database/coDatabase.js";
import CBot from "./Class/CBot.js";

let bot = new CBot(connection)

bot.bd = connection;
bot.bd.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

bot.bd.query("SHOW tables", (err, results) => {
    if(!err)
    {
        console.log(results)
    }
})

bot.once(Events.ClientReady, async() => {

    if(!bot.user) return;
    console.log("bot",bot.user.tag,"is online :)");
    bot.user.setUsername("Yoichi")
    bot.user.setPresence({activities : [{name : "Vinland Saga" , type : ActivityType.Watching}], status : "dnd"});
    await loadCommandsOnAllServers(bot);
    await loadEvenements(bot);
    
})


bot.login(process.env.TOKEN);


