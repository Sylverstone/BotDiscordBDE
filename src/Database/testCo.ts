import { Connection } from "mysql2";

export default function testCo(connection : Connection)
{
    try
    {
        connection.ping();
        //console.log("ping super");
    }
    catch(err)
    {
        console.log("[ConnectionError] Une erreur de connection a eu lieu, celle-ci sera relancé")
        return false;
    }
}