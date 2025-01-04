import { Client, Events } from "discord.js";
import loadCommands from "./Loaders/Commands/LoadCommands.js";
import loadEvenements from "./Loaders/EVents/loadEvenements.js"
import dotenv from "dotenv"
dotenv.config();

const bot = new Client({intents : 53608447})

loadCommands();
loadEvenements(bot);

bot.on(Events.ClientReady, bot => {
    console.log(bot.user.tag)
})


bot.login(process.env.TOKEN);