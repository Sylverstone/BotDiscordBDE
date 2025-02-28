import { CommandInteraction} from 'discord.js';
import transfromOptionToObject from './transfromOptionToObject.js';
import EmptyObject from './LookIfObjectIsEmpty.js';
import CBot from '../Class/CBot.js';
import {  RowDataPacket } from 'mysql2';
import { listCommandObject_t } from './transfromOptionToObject.js';
import createConnection from '../Database/createConnection.js';
import testCo from '../Database/testCo.js';

export async function SaveValueToDB(message : CommandInteraction,bot : CBot,table : string,object = {}, deleteAllOtherValues = false)
{
    if(!message.guild || !(message instanceof CommandInteraction)) return;
    let optionObject : listCommandObject_t ;
    if(EmptyObject(object))
    {
        optionObject = transfromOptionToObject(message);  
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
    if(!testCo(bot.bd))
    {
        bot.bd = createConnection();
    }
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
  if(!testCo(bot.bd))
  {
      bot.bd = createConnection();
  }
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
    if(!testCo(bot.bd))
    {
        bot.bd = createConnection();
    }
    
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
    if(!testCo(bot.bd))
    {
        bot.bd = createConnection();
    }
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
	if(!testCo(bot.bd))
	{
		bot.bd = createConnection();
	}
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
export async function lookIfIdExist(table : string, champId : string, cibleId : number, bot : CBot, message : CommandInteraction)
{
	if(!message.guild) return;
	const guildId = message.guild.id;
	const commandSQL = `SELECT count(*) as nbId FROM ${table} WHERE ${champId} = ${cibleId} AND GuildId = ${guildId}`;
	if(!testCo(bot.bd))
	{
		bot.bd = createConnection();
	}
	return new Promise((resolve, reject) => {
		bot.bd.query<RowDataPacket[]>(commandSQL, (err, result : RowDataPacket[]) => {
			if (err) {
				reject(err); // Rejeter la promesse en cas d'erreur
				return;
			}
			if(result.length > 0)
			{
				resolve(result[0]["nbId"]);
			}			
		});
	});
}
export async function deleteFromTableWithId(table : string, champId : string, cibleId : number, bot : CBot,message : CommandInteraction)
{
	if(!message.guild) return;
	const guildId = message.guild.id;
	const commandSQL = `DELETE FROM ${table} WHERE ${champId} = ${cibleId} AND GuildId = ${guildId}`;
	if(!testCo(bot.bd))
	{
		bot.bd = createConnection();
	}
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

export async function deleteFromTableWithName(table : string, champName : string, cibleName : string, bot : CBot, guildId : number)
{

	const commandSQL = `DELETE FROM ${table} WHERE ${champName} = '${cibleName}' AND GuildId = ${guildId}`;
	if(!testCo(bot.bd))
	{
		bot.bd = createConnection();
	}
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
