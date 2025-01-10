import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config()

console.log(process.env.URLDB)
let connection;
const inServ = process.env.InSERV;
if(inServ==="oui")
{
    const dbURL = new URL(process.env.URLDB)
    connection = mysql.createConnection(
        {
            host: dbURL.hostname,
            user: dbURL.username,
            password: dbURL.password,
            database: dbURL.pathname.substring(1),
            port: dbURL.port || 3306,
        }
        
    )
}

else
{
    connection = mysql.createConnection(process.env.URLPUBLICDB);
}

export {connection}

