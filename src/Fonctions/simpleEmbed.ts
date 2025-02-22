import { EmbedBuilder } from "@discordjs/builders";

export default function simpleEmbed(content : string, title = "Attention"){
    return new EmbedBuilder()
                .setTitle(title)
                .setDescription(content);
}