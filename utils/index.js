import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "tcgattendancetracker-attendancetracker.c.aivencloud.com",
  user: "avnadmin",
  database: "defaultdb",
  password:"AVNS_o1qguremapF_YO9Oi68",
  port:28058
});

export const db = drizzle(connection);
