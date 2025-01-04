import fs from "fs"
import path from "path"

const loadEvenements = async bot =>
{
    const Events = fs.readdirSync("Events").filter(file => file.endsWith(".js"))
    for(const file of Events)
    {
        const {exec,name} = await import(path.join("..","..","Events",file));
        bot.on(name, interaction => exec(bot,interaction))
    }
}

export default loadEvenements;