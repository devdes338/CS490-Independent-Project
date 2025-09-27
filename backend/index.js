import express from "express";
import { createPool } from 'mysql2/promise';
import { topRentedFilms } from "./queries.js";
import dotenv from 'dotenv';
import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:5173"]
};
dotenv.config();

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json());

  // create the connection to database
let pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/top-films", async (req, res) => {
  try {
    const [rows] = await pool.query(topRentedFilms);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const [rows] = await pool.query(topRentedFilms);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});