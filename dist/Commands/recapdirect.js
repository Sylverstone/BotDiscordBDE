import "dotenv/config";
export const description = "Cette commande écrit le dernier récap dans le chat";
export const name = "recapdirect";
export const howToUse = "Vous n'avez qu'a tapez `/recapdirect` et la commande renverra le dernier récap dans le chat directement";
export const run = async (bot, message) => {
    await message.reply("le recap en entier :) (flemme de faire ça mais si c'est demandé je fais)");
};
