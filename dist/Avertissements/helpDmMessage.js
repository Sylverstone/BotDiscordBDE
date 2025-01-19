import "dotenv/config";
export const run = async (message) => {
    return message.reply("Dans les DM, Discord n'a pas encore mit en place les Slashcommand, alors pour utiliser une commande il faut remplacer le '/' par un '!'");
};
