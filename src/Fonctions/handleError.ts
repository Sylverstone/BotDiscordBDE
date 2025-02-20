import { CommandInteraction,DiscordAPIError, EmbedBuilder} from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";
import make_log from "./makeLog.js";

export default function handleError(message : CommandInteraction , error : Error)
{
    make_log(false,message);
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