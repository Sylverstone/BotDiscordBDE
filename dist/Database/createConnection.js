import "dotenv/config";
import * as mysql from "mysql2";
export default function createConnection() {
    let connection;
    const inServ = process.env.InSERV;
    if (inServ === "oui") {
        if ((typeof process.env.URLDB === "string")) {
            connection = mysql.createConnection(process.env.URLDB);
        }
    }
    else {
        if ((typeof process.env.URLPUBLICDB === "string")) {
            connection = mysql.createConnection(process.env.URLPUBLICDB);
        }
    }
    return connection;
}
