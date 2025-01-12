import { CommandInteraction, MessageFlags } from "discord.js";
export default async function displayEmbedsMessage(message, bot, embedText) {
    if (message instanceof CommandInteraction) {
        await message.reply({
            embeds: [embedText],
            flags: [MessageFlags.Ephemeral],
        });
    }
    else {
        await message.reply({
            embeds: [embedText]
        });
    }
}
