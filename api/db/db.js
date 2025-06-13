import mysql from "mysql2";
import fs from "fs";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER ,
  port: process.env.DB_PORT ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./ca.pem') 
  }
});

// For Debugging Purposes: Check if the connection is successful
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database");
    connection.release();
  }
});

export { pool };
