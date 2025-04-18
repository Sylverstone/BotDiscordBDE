import * as fs from "fs"
import * as path from "path"
import __dirname from "../../dirname.js"
import CBot, {interaction_t, scriptEvent_t} from "../../Class/CBot.js"
import { pathToFileURL } from "url"
import { CommandInteraction, Guild, GuildScheduledEvent, Message } from "discord.js"

type exec_t = (Bot : CBot, message : interaction_t) => Promise<void>;

const loadEvenements = async (bot : CBot) =>
{
    try
    {
        const Events = fs.readdirSync(path.join("dist","Events")).filter(file => file.endsWith(".js"))
        console.log("loading",Events.length,"events")
        for(const file of Events)
        {
            const Event : scriptEvent_t = await import(pathToFileURL(path.join(__dirname,"Events",file)).href);
            const name : string = Event.name;
            const exec : exec_t = Event.exec;
            bot.on(name, (interaction : interaction_t) => exec(bot,interaction));
        }
        console.log("successfully loaded",Events.length,"events");
    }
    catch(error)
    {
        console.error("[ERROR] Error while loading events :",error);
        throw error;
    }
    
}

export default loadEvenements;