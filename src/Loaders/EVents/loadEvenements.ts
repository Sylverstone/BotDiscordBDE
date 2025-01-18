import * as fs from "fs"
import * as path from "path"
import __dirname from "../../dirname.js"
import CBot from "../../Class/CBot.js"
import { pathToFileURL } from "url"

const loadEvenements = async (bot : CBot) =>
{
    try
    {
        const Events = fs.readdirSync(path.join("dist","Events")).filter(file => file.endsWith(".js"))
        console.log("loading",Events.length,"events")
        for(const file of Events)
        {
            
            const {exec,name} = await import(pathToFileURL(path.join(__dirname,"Events",file)).href);
            bot.on(name, (interaction) => exec(bot,interaction));
        }
        console.log("successfully loaded",Events.length,"events")
    }
    catch(error)
    {
        console.error("Error while loading events :",error);
        throw error;
    }
    
}

export default loadEvenements;