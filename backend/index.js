import express from "express";
import { createPool } from 'mysql2/promise';
import * as queries from "./queries.js";
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
    const [rows] = await pool.query(queries.topRentedFilms);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/top-actors", async (req, res) => {
  try {
    const [rows] = await pool.query(queries.topActors);
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

    const [rows] = await pool.query(queries.actorTopFilms, [actor_id]);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/search-films", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ error: "Search query required" });
    }

    const sanitized = query.trim();
    const wildcard = `%${sanitized}%`;
    const params = [wildcard, wildcard, wildcard, wildcard];
    /*Array(4).fill(wildcard);*/

    const [rows] = await pool.query(queries.filmSearchResults, params);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/search-customers", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ error: "Search query required" });
    }

    const sanitized = query.trim();
    const wildcard = `%${sanitized}%`;
    const params = [sanitized, wildcard, wildcard];

    const [rows] = await pool.query(queries.customerSearchResults, params);
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

    const [rows] = await pool.query(queries.filmStock, [film_id]);
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
  const { customer_id, film_id } = req.body;
  if (!customer_id) return res.status(400).json({ error: "customer_id required" });
  if (!film_id) return res.status(400).json({ error: "film_id required" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [availRows] = await conn.query(queries.availableFilm, [film_id]);
    if (!availRows || availRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "No available copy" });
    }
    const inventory_id = availRows[0].inventory_id;

    const [rentalResult] = await conn.execute(queries.insertRental, [inventory_id, customer_id]);
    const rentalId = rentalResult.insertId;

    const [paymentResult] = await conn.execute(queries.insertPayment, [customer_id, rentalId]);
    
    await conn.commit();
    res.status(201).json({
      rentalId,
      paymentId: paymentResult.insertId
    });
    res.status(201).json({insertRentalID: rental, insertPaymentID : payment});
  } catch (err) {
    await conn.rollback().catch(()=>{});
    console.error("Could not insert into database", err);
    res.status(500).json({ error: "Server error", details: err.message });
  } finally {
    conn.release();
  }
});

app.get('/customer', async (req, res) => {
  try {
    const [rows] = await pool.query(queries.customerList);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post('/new-customer', async (req, res) => {
  try {

    const { firstName, lastName, email } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({ error: "firstName, lastName and email are required" });
    }

    const [result] = await pool.execute(queries.newCustomer, [
      firstName.trim(),
      lastName.trim(),
      email.trim()
    ]);

    res.status(201).json({insertedId: result.insertId});
  } catch (err) {
    console.error("DB insert error:", err)
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

app.put('/edit-customer', async (req, res) => {
  try {
    const { customer_id, firstName, lastName, email } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({ error: "firstName, lastName and email are required" });
    }

    const [result] = await pool.execute(queries.editCustomer, [
      firstName.trim(),
      lastName.trim(),
      email.trim(),
      customer_id
    ]);

    res.status(201).json({updatedId: result});
  } catch (err) {
    console.error("DB update error:", err)
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

app.delete('/delete-customer', async (req, res) => {
  try {
    const { customer_id } = req.body;
    if (!customer_id) return res.status(400).json({ error: "customer_id required" });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute('DELETE FROM sakila.payment WHERE customer_id = ?', [customer_id]);
      await conn.execute('DELETE FROM sakila.rental WHERE customer_id = ?', [customer_id]);

      const [result] = await conn.execute('DELETE FROM sakila.customer WHERE customer_id = ?', [customer_id]);

      await conn.commit();
      res.json({ deletedId: customer_id, affectedRows: result.affectedRows });
    } catch (err) {
      await conn.rollback();
      console.error("DB delete error:", err);
      res.status(500).json({ error: "Database delete error", details: err.message });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.get('/customer-rented', async (req, res) => {
  try {
    const { customer_id } = req.body;
    const [rows] = await pool.query(queries.customerRented,[customer_id]);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get('/customer/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const [rows] = await pool.query('SELECT * FROM sakila.customer WHERE customer_id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('DB select error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/customer/:id/rented', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const [rows] = await pool.query(queries.customerRented, [id]);
    res.json(rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put('/return-film', async (req, res) => {
  try {
    const { rental_id } = req.body;
    if (!rental_id) return res.status(400).json({ error: 'invalid id' });
    const [result] = await pool.execute(queries.returnFilm,[rental_id]);
    res.status(201).json({updatedId: result});
  } catch (error) {
    console.error("DB update error:", err)
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});