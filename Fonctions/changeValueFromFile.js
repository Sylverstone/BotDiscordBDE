import { CommandInteraction} from 'discord.js';
import fs from 'fs';
import { json } from 'stream/consumers';

/**
 * @typedef {Object} ReturnObject
 * @property {any | null } option
 * @property {Object} jsonData
 */

/**
 * 
 * @param {string} optionName 
 * @param {CommandInteraction} message 
 * @param {string} key 
 * @param {(ancienneValeur : string, value:string, message,jsonData) => void} callback 
 * @param {string} pathJSON 
 * @returns {ReturnObject} ReturnObject
 */
export function changeValueFromFile(optionName,message,key,callback, args = [null],version = 0,pathJSON = "JSON/data.json")
{
    let option;
    if(version === 0)
    {
        option = message.options.get(optionName);
    }else{
        option = args[0];
    }
    
    const jsonFile = fs.readFileSync(pathJSON,"utf-8");
    const jsonData = JSON.parse(jsonFile);
    let value = null;
    let ancienneValeur = null;
    if(option !== null)
    {
        if(version === 0)
        {
            value = option.value;
        }
        else
        {
            value = option;
        }
        
        ancienneValeur = jsonData[key];
        jsonData[key] = value;
        console.log(jsonData);
        callback(ancienneValeur, value,message,jsonData);
    }
    console.log("fin fichier")
    return {option : option, jsonData : jsonData}
}