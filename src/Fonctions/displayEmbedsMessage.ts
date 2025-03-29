import {
    CommandInteraction,
    EmbedBuilder,
    Message,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction
} from "discord.js";

export default async function displayEmbedsMessage(message: CommandInteraction | Message | StringSelectMenuInteraction,embedText : EmbedBuilder, edit = false)
{
    
    
    if(message instanceof CommandInteraction || message instanceof StringSelectMenuInteraction)
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
            await message.editReply({content : "",embeds : [embedText]});
        }
        
    }
    else
    {
        await message.reply({
            embeds : [embedText]
        });
    }
}


