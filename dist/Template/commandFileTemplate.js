import "dotenv/config";
import handleError from "../Fonctions/handleError.js";
export const description = "";
export const name = "";
export const onlyGuild = true;
export const howToUse = "";
export const run = async (bot, message) => {
    try {
    }
    catch (error) {
        if (error instanceof Error)
            handleError(message, error, true);
    }
};
