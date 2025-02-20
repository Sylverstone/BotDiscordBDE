import { CommandInteraction, EmbedBuilder, Message , MessageFlags} from "discord.js";
import CBot from "../Class/CBot";

export default async function displayEmbedsMessage(message: CommandInteraction | Message,embedText : EmbedBuilder )
{
    if(message instanceof CommandInteraction)
    {
        await message.reply({
            embeds : [embedText],
            flags : [MessageFlags.Ephemeral],
        });
    }
    else
    {
        await message.reply({
            embeds : [embedText]
        });
    }
}
