import { ActivityType, Events } from "discord.js";
import { loadCommandsOnAllServers } from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js";
import CBot from "./Class/CBot.js";
import "dotenv/config";
import createConnection from "./Database/createConnection.js";
let connection = createConnection();
let bot = new CBot(connection);
bot.bd = connection;
bot.bd.connect((err) => {
    if (err)
        throw err;
    console.log("Connected to MySQL!");
});
bot.once(Events.ClientReady, async () => {
    if (!bot.user)
        return;
    console.log("bot", bot.user.tag, "is online :)");
    await bot.user.setUsername("Yoichi");
    bot.user.setPresence({ activities: [{ name: "Vinland Saga", type: ActivityType.Watching }], status: "dnd" });
    await loadCommandsOnAllServers(bot);
    await loadEvenements(bot);
});
bot.login(process.env.TOKEN);
