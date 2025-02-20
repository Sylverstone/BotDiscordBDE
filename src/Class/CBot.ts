import { Client, Collection, GatewayIntentBits, CommandInteraction, Partials, SlashCommandStringOption, SlashCommandIntegerOption, SlashCommandUserOption, SlashCommandNumberOption } from "discord.js"
import { Connection } from "mysql2/typings/mysql/lib/Connection";


export interface commands_t{
    [key: string]: any;
}

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
                GatewayIntentBits.GuildModeration
            ],
            partials : [Partials.Channel],
        })

        this.commands = new Collection();
        this.bd = connection;
    }
}
