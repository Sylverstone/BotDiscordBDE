import { Connection } from "mysql2/typings/mysql/lib/Connection";

export default function testCo(connection : Connection)
{
    try
    {
        connection.ping((err) => {
            if(err) throw err;
            console.log("[ConnectionTest] Connection test succed")
            return true;
        });
    }
    catch(err)
    {
        console.log("[ConnectionError] Une erreur de connection a eu lieu, celle-ci sera relancé")
        return false;
    }
}