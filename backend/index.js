import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createConnection } from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.json);

try {
  // create the connection to database
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });


    console.log();
    await connection.end();
    
} catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});