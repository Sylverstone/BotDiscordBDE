import {Client, CommandInteraction, SlashCommandStringOption} from 'discord.js';
import events from "events";
import readline from 'readline';
import { changeValueFromFile } from '../Fonctions/scripts';
import fs from "fs";

const description = "Avec cette commande vous pouvez récupérer la prochaine reunion planifié, ainsi qu'en planifié une vous même, avec le paramètre date_reunion";

const name = "reunion";
const option = new SlashCommandStringOption()
    .setName("date_reunion")
    .setRequired(false)
    .setDescription("Paramètre permettant de définir une nouvelles dates :)")
    
const run = async (bot, message, args) =>
{
    try {

        if(bot instanceof Client && message instanceof CommandInteraction)
        {
            
            const options = message.options.get("date_reunion");
            const goal = "prochainereunion";
            let indexGoal = null;
            const fluxLecture = fs.createReadStream("data.txt")
            const rl = readline.createInterface(
                {
                    input :fluxLecture,
                    crlfDelay: Infinity,
                }
            )

            let allLines = []
            if(options !== null)
            {
                let { value } = options;
                
                if(typeof value === "string")
                {
                    console.log(typeof value)
                    value = value.replaceAll('-','/')
                    
                    
                    console.log(value)
        
                    
                    rl.on('line', line => {
                        console.log(line)
                        allLines.push(line)
                        if(line.toLowerCase() === goal)
                        {
                            indexGoal = allLines.length - 1;
                        }
                    })
        
                    await events.once(rl,'close');
                    const ancienneValeur = allLines[indexGoal+1]
                    
                    if(!verifierDate(ancienneValeur,value))
                    {
                        await message.reply(`La nouvelles date de reunion que tu essaies d'entrer est inférieur a l'ancienne :) PAS LOGIQUE`)
                    }
                    else 
                    {
                        allLines[indexGoal + 1] = value;
                        let newContent = "";
            
                        allLines.forEach(line => newContent += line +"\n");
                        fs.writeFileSync("data.txt",newContent)
            
                        await message.reply(`La nouvelle date de reunion a bien été enregistré ! (${ancienneValeur}->${value})`)
                    }
                    
                }
                else 
                {
                    throw TypeError("Value n'est pas du bon type :)")
                }
                
            }
            else {
                
    
                rl.on('line', line => {
                    console.log(line)
                    allLines.push(line.toLowerCase())
                    if(line.toLowerCase() === goal)
                    {
                        indexGoal = allLines.length - 1;
                    }
                })
                
                

                await events.once(rl,'close');
                const date = allLines[indexGoal + 1];
                console.log(date);

                const [jour, mois, annee] = date.split("/");
                const datefr = jour+"/"+mois+"/"+annee;
                const prochaineReunion = new Date(`${annee}-${mois}-${jour}`);
                const dateActu = new Date();
                if(prochaineReunion > dateActu)
                {
                    await message.reply("Salut jeune chevalier :)\n # non je déconne crois pas \nAlors ducoup, la prochaine reunion c'est le " + datefr)
                }
                else
                {
                    await message.reply("t'es préssé de ouf hein ? pas de prochaine reunion, la dernière date de " + datefr);
                }
            }
            
        }
    } catch (error) {
        console.log(error)
        await message.reply("Une erreur a eu lieu durant l'éxécution de cette commande, super les devs !");
    }
    
};

const convertToDate = (date) => {
    const [jour, mois, annee] = date.split("/");
    const dateOrigine = jour+"/"+mois+"/"+annee;
    return new Date(`${annee}-${mois}-${jour}`);
}
function verifierDate(dateOrigine,NouvelleDate)
{
    dateOrigine = convertToDate(dateOrigine);
    NouvelleDate = convertToDate(NouvelleDate);
    return NouvelleDate > dateOrigine && (NouvelleDate instanceof Date && dateOrigine instanceof Date);
}
export{description,name,run,option}
