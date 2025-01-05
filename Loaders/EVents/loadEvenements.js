import fs from "fs"
import path from "path"
import __dirname from "../../dirname.js"
import { pathToFileURL } from "url"

const loadEvenements = async bot =>
{
    const Events = fs.readdirSync("Events").filter(file => file.endsWith(".js"))
    for(const file of Events)
    {
        
        const {exec,name} = await import(pathToFileURL(path.join(__dirname,"Events",file)));
        bot.on(name, interaction => exec(bot,interaction))
    }
}

export default loadEvenements;