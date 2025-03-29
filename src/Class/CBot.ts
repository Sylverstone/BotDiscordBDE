import { Client, Collection, GatewayIntentBits, CommandInteraction, Partials, SlashCommandStringOption, SlashCommandIntegerOption, SlashCommandUserOption, SlashCommandNumberOption } from "discord.js"
import { Connection, ConnectionOptions } from "mysql2/typings/mysql/lib/Connection";
import * as mysql from "mysql2"

export interface commands_t{
    [key: string]: any;
}

//Type représentant l'import d'un script commande
export type script_t = 
{
    name : string;
    description : string;
    howToUse : string;
    run : any;
    option : SlashCommandStringOption[] | undefined ;
    optionInt : SlashCommandIntegerOption[] | undefined;
    onlyGuild : boolean;
    optionUser : SlashCommandUserOption[] | undefined;
    optionNum : SlashCommandNumberOption[] | undefined;

}

//Renvoie true si le paramètre est un script_t
export const isScript_t = (script : unknown) : script is script_t =>
{
    return script !== null && typeof script === "object"  && "name" in script && "description" in script
            && "howToUse" in script && "run" in script && "onlyGuild" in script;
}

export default class CBot extends Client{

    public commands : Collection<string,script_t>;
    public bd : Connection;
    
    constructor(connection : Connection){
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildScheduledEvents
            ],
            partials : [Partials.Channel],
        })

        this.commands = new Collection();
        this.bd = connection;
    }
}
