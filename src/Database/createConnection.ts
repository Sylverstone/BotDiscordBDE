import "dotenv/config"
import * as mysql from "mysql2"
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export default function createConnection()
{
    let connection : Connection;
    const inServ = process.env.InSERV;
    if(inServ==="oui")
    {
        if((typeof process.env.URLDB === "string"))
        {
            connection = mysql.createConnection(process.env.URLDB)
        }
    }
    
    else
    {
        if((typeof process.env.URLPUBLICDB === "string"))
        {
            connection = mysql.createConnection(process.env.URLPUBLICDB);  
        }
        
    }
    return connection!;
}



