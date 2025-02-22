import { EmbedBuilder } from "@discordjs/builders";
export default function simpleEmbed(content, title = "Attention") {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(content);
}
