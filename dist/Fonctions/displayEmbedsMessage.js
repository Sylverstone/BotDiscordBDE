import { CommandInteraction, MessageFlags } from "discord.js";
export default async function displayEmbedsMessage(message, embedText, edit = false) {
    if (message instanceof CommandInteraction) {
        if (!edit) {
            await message.reply({
                embeds: [embedText],
                flags: [MessageFlags.Ephemeral],
            });
        }
        else {
            await message.editReply({ content: "", embeds: [embedText] });
        }
    }
    else {
        await message.reply({
            embeds: [embedText]
        });
    }
}
