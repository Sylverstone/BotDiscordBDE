import { CommandInteraction,DiscordAPIError} from "discord.js";

export default function handleError(message : CommandInteraction , error : Error)
{
    console.log("command went wrong while",message.user,"was running it\n",error)
    if(error instanceof DiscordAPIError){
        return message.reply({content : `Une erreur a eu lieu du coté de l'API discord. Votre requête a surement été réalisé`})
    }
    else{
        return message.reply({content : `Une erreur à eu lieu durant le processus`})
    }
}