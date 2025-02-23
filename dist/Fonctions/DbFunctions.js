import { CommandInteraction } from 'discord.js';
import transfromOptionToObject from './transfromOptionToObject.js';
import EmptyObject from './LookIfObjectIsEmpty.js';
export async function SaveValueToDB(message, bot, table, object = {}, deleteAllOtherValues = false) {
    if (!message.guild || !(message instanceof CommandInteraction))
        return;
    let optionObject;
    if (EmptyObject(object)) {
        optionObject = transfromOptionToObject(message);
    }
    else {
        console.log(object, "obejct");
        optionObject = object;
    }
    if (!(optionObject instanceof Object))
        return false;
    optionObject["GuildId"] = message.guild.id;
    if (deleteAllOtherValues)
        await deleteAllOtherValue(message.guild.id, table, bot);
    let optionParam = "";
    for (let key in optionObject) {
        optionParam += key + ", ";
    }
    optionParam = optionParam.slice(0, -2);
    let commandSql = `INSERT INTO ${table}(${optionParam})
    VALUES(${Object.values(optionObject).map(v => `"${v}"`).join(', ')})`;
    return new Promise(function (resolve, reject) {
        bot.bd.query(commandSql, (err, values) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
async function deleteAllOtherValue(guildID, table, bot) {
    const commandSql = `DELETE FROM ${table} WHERE GuildId = ${guildID}`;
    return new Promise(function (resolve, reject) {
        bot.bd.query(commandSql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
export async function getMostRecentValueFromDB(message, champ, table, champID, bot) {
    if (!message.guild)
        return;
    const guildId = message.guild.id;
    const commandSql = `SELECT ${champ} FROM ${table} WHERE guildId = ${guildId} ORDER BY ${champID} DESC`;
    return new Promise((resolve, reject) => {
        bot.bd.query(commandSql, (err, result) => {
            if (err) {
                reject(err); // Rejeter la promesse en cas d'erreur
                return;
            }
            if (result.length > 0) {
                resolve(result[0][champ]); // Résoudre la promesse avec le résultat
            }
            else {
                resolve(null); // Résoudre avec `null` si aucun résultat
            }
        });
    });
}
export async function getValueFromDB(message, champ, table, champID, bot) {
    if (!message.guild)
        return;
    const guildId = message.guild.id;
    const commandSql = `SELECT ${champ} FROM ${table} WHERE guildId = ${guildId} ORDER BY ${champID} DESC`;
    return new Promise((resolve, reject) => {
        bot.bd.query(commandSql, (err, result) => {
            if (err) {
                reject(err); // Rejeter la promesse en cas d'erreur
                return;
            }
            if (result.length > 0) {
                resolve(result); // Résoudre la promesse avec le résultat
            }
            else {
                resolve(null); // Résoudre avec `null` si aucun résultat
            }
        });
    });
}
export async function getLastId(table, champId, bot) {
    const commandSQL = `SELECT max(${champId}) as maxId from ${table}`;
    return new Promise((resolve, reject) => {
        bot.bd.query(commandSQL, (err, result) => {
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
export async function lookIfIdExist(table, champId, cibleId, bot, message) {
    if (!message.guild)
        return;
    const guildId = message.guild.id;
    const commandSQL = `SELECT count(*) as nbId FROM ${table} WHERE ${champId} = ${cibleId} AND GuildId = ${guildId}`;
    return new Promise((resolve, reject) => {
        bot.bd.query(commandSQL, (err, result) => {
            if (err) {
                reject(err); // Rejeter la promesse en cas d'erreur
                return;
            }
            if (result.length > 0) {
                resolve(result[0]["nbId"]);
            }
        });
    });
}
export async function deleteFromTableWithId(table, champId, cibleId, bot, message) {
    if (!message.guild)
        return;
    const guildId = message.guild.id;
    const commandSQL = `DELETE FROM ${table} WHERE ${champId} = ${cibleId} AND GuildId = ${guildId}`;
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
export async function deleteFromTableWithName(table, champName, cibleName, bot, message) {
    if (!message.guild)
        return;
    const guildId = message.guild.id;
    const commandSQL = `DELETE FROM ${table} WHERE ${champName} = '${cibleName}' AND GuildId = ${guildId}`;
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
