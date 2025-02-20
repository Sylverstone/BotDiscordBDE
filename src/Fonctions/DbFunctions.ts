import { CommandInteraction} from 'discord.js';
import * as fs from 'fs';
import transfromOptionToObject from './transfromOptionToObject.js';
import EmptyObject from './LookIfObjectIsEmpty.js';
import CBot from '../Class/CBot.js';
import {  QueryError, RowDataPacket } from 'mysql2';
import { listCommandObject_t } from './transfromOptionToObject.js';

export async function SaveValueToDB(message : CommandInteraction,bot : CBot,table : string,object = {}, deleteAllOtherValues = false)
{
    if(!message.guild || !(message instanceof CommandInteraction)) return;
    let optionObject : listCommandObject_t | null | undefined ;
    if(EmptyObject(object))
    {
        optionObject = transfromOptionToObject(message)?.optionObject;  
    }
    else
    {
      console.log(object, "obejct")
      optionObject = object;
    }

    if(!(optionObject instanceof Object)) return false;

    optionObject["GuildId"] = message.guild.id;
    if(deleteAllOtherValues)
      await deleteAllOtherValue(message.guild.id,table,bot);
    let optionParam = ""
    for(let key in optionObject)
    {
        optionParam += key + ", ";
    }

    optionParam = optionParam.slice(0,-2);
    let commandSql = `INSERT INTO ${table}(${optionParam})
    VALUES(${Object.values(optionObject).map(v => `"${v}"`).join(', ')})`;
    return new Promise(function(resolve, reject){
      bot.bd.query(commandSql, (err,values) => {
        if(err)
        {
            reject(err);
            return;
        }
        resolve(true);
        }
      )
    })
}

async function deleteAllOtherValue(guildID : string,table : string,bot :  CBot)
{
  const commandSql = `DELETE FROM ${table} WHERE GuildId = ${guildID}`;
  return new Promise(function(resolve, reject){
    bot.bd.query(commandSql, (err, result) => {
      if(err)
      {
          reject(err);
          return;
      }
      resolve(true);
    }
    )
  });
}

export async function getMostRecentValueFromDB(message : CommandInteraction,champ :string,table:string,champID : string,bot : CBot)
{
    if(!message.guild) return;
    const guildId = message.guild.id;
    const commandSql = `SELECT ${champ} FROM ${table} WHERE guildId = ${guildId} ORDER BY ${champID} DESC`;
    return new Promise((resolve , reject)  => {
        bot.bd.query<RowDataPacket[]>(commandSql, (err, result : Array<RowDataPacket>) => {
          if (err) {
            reject(err); // Rejeter la promesse en cas d'erreur
            return;
          }
          if (result.length > 0) {
            resolve(result[0][champ]); // Résoudre la promesse avec le résultat
          } else {
            resolve(null); // Résoudre avec `null` si aucun résultat
          }
        });
      });
}

export async function getValueFromDB(message : CommandInteraction,champ :string,table:string,champID : string,bot : CBot)
{
    if(!message.guild) return;
    const guildId = message.guild.id;
    const commandSql = `SELECT ${champ} FROM ${table} WHERE guildId = ${guildId} ORDER BY ${champID} DESC`;
    return new Promise((resolve , reject)  => {
        bot.bd.query<RowDataPacket[]>(commandSql, (err, result : Array<RowDataPacket>) => {
          if (err) {
            reject(err); // Rejeter la promesse en cas d'erreur
            return;
          }
          if (result.length > 0) {
            resolve(result); // Résoudre la promesse avec le résultat
          } else {
            resolve(null); // Résoudre avec `null` si aucun résultat
          }
        });
      });
}

export async function getLastId(table : string, champId : string,bot : CBot) 
{
	const commandSQL = `SELECT max(${champId}) as maxId from ${table}`;
	return new Promise((resolve , reject)  => {
	bot.bd.query<RowDataPacket[]>(commandSQL, (err, result : Array<RowDataPacket>) => {
		if (err) {
			reject(err); // Rejeter la promesse en cas d'erreur
			return;
		}
		if (result.length > 0) {
			resolve(result[0]); // Résoudre la promesse avec le résultat
		} 
		else {
			resolve(null); // Résoudre avec `null` si aucun résultat
		}
	});
	});

}

export async function deleteFromTableWithId(table : string, champId : string, cibleId : number, bot : CBot)
{
	const commandSQL = `DELETE FROM ${table} WHERE ${champId} = ${cibleId}`;
    return new Promise((resolve, reject) => {
    bot.bd.query(commandSQL, (err, result) => {
        if (err) {
            reject(err); // Rejeter la promesse en cas d'erreur
            return;
        }
        resolve(true);
    });
    });
}
