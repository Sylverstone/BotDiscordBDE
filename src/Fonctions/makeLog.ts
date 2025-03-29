import { CommandInteraction } from "discord.js";

export const messageCommandToString = (message : CommandInteraction) : string => 
{
    let finalText : string = `${message.commandName} `;
    message.options.data.forEach((option) => {
        finalText += `${option.name}:${option.value} `;
    });
    return finalText;
}

export default function make_log(succes : boolean,message : CommandInteraction)
{

    if(succes)
    {
        console.log(`[LOG] Commande effectuée avec succès : ${messageCommandToString(message)}`);
    }
    else
    {
        console.error(`[ERROR] Impossible d'effectuer la commande : ${messageCommandToString(message)}`);
    }
    
}