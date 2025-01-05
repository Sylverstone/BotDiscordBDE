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
export function changeValueFromFile(optionName,message,key,callback, pathJSON = "JSON/data.json")
{
    const option = message.options.get(optionName);
    const jsonFile = fs.readFileSync(pathJSON,"utf-8");
    const jsonData = JSON.parse(jsonFile);
    let value = null;
    let ancienneValeur = null;
    if(option !== null)
    {
        value = option.value;
        ancienneValeur = jsonData[key];
        jsonData[key] = value;
        console.log(jsonData);
        callback(ancienneValeur, value,message,jsonData);
    }
    console.log("fin fichier")
    return {option : option, jsonData : jsonData}
}