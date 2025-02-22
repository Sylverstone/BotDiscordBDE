import { CommandInteraction, EmbedBuilder, Message , MessageFlags} from "discord.js";

export default async function displayEmbedsMessage(message: CommandInteraction | Message,embedText : EmbedBuilder, edit = false)
{
    
    
    if(message instanceof CommandInteraction)
    {
        if(!edit)
        {
            await message.reply({
                embeds : [embedText],
                flags : [MessageFlags.Ephemeral],
            });
        }
        else
        {
            await message.editReply({embeds : [embedText]});
        }
        
    }
    else
    {
        await message.reply({
            embeds : [embedText]
        });
    }
}
