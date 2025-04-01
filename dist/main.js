import { ActivityType, Events } from "discord.js";
import { loadCommandsOnAllServers } from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js";
import CBot from "./Class/CBot.js";
import "dotenv/config";
import createConnection from "./Database/createConnection.js";
import date from "./Class/Date/Date.js";
import annee from "./Class/Date/Annee.js";
import mois from "./Class/Date/Mois.js";
import Jour from "./Class/Date/Jour.js";
let connection = createConnection();
let bot = new CBot(connection);
bot.bd.connect((err) => {
    if (err)
        throw err;
    console.log("Connected to MySQL!");
});
const a = new annee(2000);
const m3 = new mois(3, a);
const m4 = new mois(4, a);
console.log(m3.toSeconde());
console.log(m4.toSeconde());
const j1 = new Jour(1);
const j2 = new Jour(31);
console.log(j1.toSeconde());
console.log(j2.toSeconde());
const t1 = new date("01-04-2025");
const t2 = new date("31-03-2025");
console.log(t1);
console.log(t2);
console.log(t1.getTime() > t2.getTime());
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
