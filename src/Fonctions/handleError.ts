import {CommandInteraction, DiscordAPIError, EmbedBuilder, ModalSubmitInteraction} from "discord.js";
import displayEmbedsMessage from "./displayEmbedsMessage.js";
import make_log from "./makeLog.js";
import {Color} from "../Enum/Color.js";

export default function handleError(message : CommandInteraction | ModalSubmitInteraction, error : Error,edit = false)
{
    if(message instanceof CommandInteraction)
        make_log(false,message);
    console.log("[error] " + error);
    if(error instanceof DiscordAPIError){
        displayEmbedsMessage(message,new EmbedBuilder()
                                            .setTitle("Erur")
                                            .setDescription("Une erreur du côté de l'API de discord a eu lieu")
                                            .setColor(Color.failureColor)
    
        ,edit)
        return;
    }
    else{
        displayEmbedsMessage(message,new EmbedBuilder()
                                            .setTitle("Erreur")
                                            .setDescription("Une erreur a eu lieu")
                                            .setColor(Color.failureColor)
        ,edit);
        return;
    }
}