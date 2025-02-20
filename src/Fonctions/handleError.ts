import { CommandInteraction,DiscordAPIError, EmbedBuilder} from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";

export default function handleError(message : CommandInteraction , error : Error)
{
    console.log("command went wrong while",message.user.username,"was running it\n",error)
    if(error instanceof DiscordAPIError){
        displayEmbedsMessage(message,new EmbedBuilder()
                                            .setTitle("Erreur")
                                            .setDescription("Une erreur du côté de l'API de discord a eu lieu")
    
        )
        return;
    }
    else{
        displayEmbedsMessage(message,new EmbedBuilder()
                                            .setTitle("Erreur")
                                            .setDescription("Une erreur du côté de l'API de discord a eu lieu")
        );
        return;
    }
}