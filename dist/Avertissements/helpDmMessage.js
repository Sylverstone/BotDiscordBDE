import "dotenv/config";
export const description = "Cette commande vous indiquera les commandes du bot";
export const name = "help";
export const notAcommand = true;
export const run = async (bot, message) => {
    message.reply("Dans les DM, Discord n'a pas encore mit en place les Slashcommand, alors pour utiliser une commande il faut remplacer le '/' par un '!'");
};
