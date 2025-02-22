import {  CommandInteraction } from "discord.js";



export type listCommandObject_t = {
    [key : string] : string | number | boolean | undefined; 
}

export type returnOptionToObj_t = {optionObject : listCommandObject_t, ObjectIsReal : boolean } 

export default function transfromOptionToObject(message : CommandInteraction) : listCommandObject_t {
    let optionObject : listCommandObject_t = {};
    
    let option = message.options.data;
    if(option !== null)
    {
        option.forEach(o => {optionObject[o.name] = o.value;});
    }
    
    return optionObject;
}
