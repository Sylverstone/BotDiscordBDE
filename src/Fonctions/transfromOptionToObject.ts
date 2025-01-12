import {  CommandInteraction } from "discord.js";



export type listCommandObject_t = {
    [key : string] : string | number | boolean | undefined; 
}

export type returnOptionToObj_t = {optionObject : listCommandObject_t, ObjectIsReal : boolean } 

export default function transfromOptionToObject(message : CommandInteraction) : returnOptionToObj_t {
    let ObjectIsReal = false;
    let optionObject : listCommandObject_t = {};
    
    let option = message.options.data;
    if(option !== null)
    {
        option.forEach(o => {optionObject[o.name] = o.value; ObjectIsReal = true;});
    }
    
    return { optionObject , ObjectIsReal};
}
