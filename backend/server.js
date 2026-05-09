const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "ticketdb",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.get("/", (req, res) => {
  res.send("Ticket Booking Backend API is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Backend healthy" });
});

app.get("/events", (req, res) => {
  const query = "SELECT * FROM events";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch events" });
    }

    res.json(results);
  });
});

app.post("/book", (req, res) => {
  const { event_id, customer_name, email, tickets } = req.body;

  const query =
    "INSERT INTO bookings (event_id, customer_name, email, tickets) VALUES (?, ?, ?, ?)";

  db.query(
    query,
    [event_id, customer_name, email, tickets],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Booking failed" });
      }

      res.json({ message: "Ticket booked successfully" });
    }
  );
});

app.get("/bookings", (req, res) => {
  const query = `
    SELECT 
      bookings.id,
      events.name AS event_name,
      bookings.customer_name,
      bookings.email,
      bookings.tickets,
      bookings.booking_time
    FROM bookings
    JOIN events ON bookings.event_id = events.id
    ORDER BY bookings.booking_time DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }

    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});