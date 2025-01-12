import "dotenv/config"
import * as mysql from "mysql2"
import { Connection } from "mysql2/typings/mysql/lib/Connection";

console.log(process.env.URLDB)
let connection : Connection;
const inServ = process.env.InSERV;
if(inServ==="oui")
{
    if((typeof process.env.URLDB === "string"))
    {
        const dbURL = new URL(process.env.URLDB);

        connection = mysql.createConnection(
            {
                host: dbURL.hostname,
                user: dbURL.username,
                password: dbURL.password,
                database: dbURL.pathname.substring(1),
                port: +dbURL.port || 3306,
            }
            
        )
    }
    
}

else
{
    if((typeof process.env.URLPUBLICDB === "string"))
    {
        connection = mysql.createConnection(process.env.URLPUBLICDB);  
    }
    
}

export {connection}

