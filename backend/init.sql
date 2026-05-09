CREATE DATABASE IF NOT EXISTS ticketdb;

USE ticketdb;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100),
  price INT,
  available_seats INT
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  customer_name VARCHAR(100),
  email VARCHAR(100),
  tickets INT,
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events (name, location, price, available_seats)
VALUES
('Coldplay Live Concert', 'Bangalore', 4500, 200),
('IPL Final Match', 'Chinnaswamy Stadium', 3500, 150),
('Tech Conference 2026', 'Bangalore Palace', 1200, 300),
('Standup Comedy Night', 'Indiranagar', 800, 100);