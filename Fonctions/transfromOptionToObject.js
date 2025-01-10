import {  CommandInteraction } from "discord.js";


export default function transfromOptionToObject(message){
    let ObjectIsReal = false;
    let optionObject = {};
    if(!(message instanceof CommandInteraction)) return;
    
    let option = message.options.data;
    if(option !== null)
    {
        option.forEach(o => {optionObject[o.name] = o.value; ObjectIsReal = true;});
    }
    
    return { optionObject : optionObject, ObjectIsReal : ObjectIsReal };
}
