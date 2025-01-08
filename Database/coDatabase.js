import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config()

console.log(process.env.URLDB)
const dbURL = new URL(process.env.URLDB)
const connection = mysql.createConnection(
    {
        host: dbURL.hostname,
        user: dbURL.username,
        password: dbURL.password,
        database: dbURL.pathname.substring(1),
        port: dbURL.port || 3306,
      }
    
)

connection.connect(err => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to the database successfully!');
  });
export {connection}

