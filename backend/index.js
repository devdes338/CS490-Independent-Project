import express from "express";
import { createPool } from 'mysql2/promise';
import { topRentedFilms } from "./queries.js";
import { topActors } from "./queries.js";
import { actorTopFilms } from "./queries.js";
import { searchResults } from "./queries.js";
import { filmStock } from "./queries.js";
import { customerList } from "./queries.js";
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

app.get("/top-actors", async (req, res) => {
  try {
    const [rows] = await pool.query(topActors);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/actor-top-films", async (req, res) => {
  try {
    const actor_id = req.body?.actor_id;
    if (!actor_id) return res.status(400).json({error: "actor_id required"});

    const [rows] = await pool.query(actorTopFilms, [actor_id]);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/search", async (req, res) => {
  try {
    //Retrieve query, sanatize, and prepare wildcards
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ error: "Search query required" });
    }

    const sanitized = query.trim();
    const wildcard = `%${sanitized}%`;
    const params = [wildcard, wildcard, wildcard, wildcard];
    /*Array(4).fill(wildcard);*/

    const [rows] = await pool.query(searchResults, params);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/film-stock", async(req, res) => {

  try {
    const { film_id } = req.body;
    if (!film_id) return res.status(400).json({error: "film required"});

    const [rows] = await pool.query(filmStock, [film_id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ stock: 0, total_copies: 0, currently_rented: 0 });
    }

    const row = rows[0];

    res.json({
      stock: row.stock ?? 0,
      total_copies: row.total_copies ?? 0,
      currently_rented: row.currently_rented ?? 0,
      film_id: row.film_id,
      title: row.title
    });

  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }

});

app.post('/rentFilm', async (req, res) => {

});

app.get('/customer', async (req, res) => {
  try {
    const [rows] = await pool.query(customerList);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});