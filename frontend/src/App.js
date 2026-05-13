import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  "http://a1d36e12793064f69bfe80c7bb20f04a-2122099976.ap-south-1.elb.amazonaws.com:5000";

function App() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    event_id: "",
    customer_name: "",
    email: "",
    tickets: 1,
  });
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      setBookings(res.data);
    } catch {
      console.log("Unable to load bookings");
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/events`)
      .then((res) => setEvents(res.data))
      .catch(() => setMessage("Unable to load events"));

    fetchBookings();
  }, []);

  const bookTicket = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/book`, form);
      setMessage("Ticket booked successfully!");

      setForm({
        event_id: "",
        customer_name: "",
        email: "",
        tickets: 1,
      });

      fetchBookings();
    } catch {
      setMessage("Booking failed. Please try again.");
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <h2>TicketFlow</h2>
        <span>Book Events Easily</span>
      </nav>

      <section className="hero">
        <h1>Book Your Favourite Events</h1>
        <p>
          Concerts, sports, tech events and comedy shows — all in one simple
          platform.
        </p>
      </section>

      <section className="events">
        <h2>Available Events</h2>

        <div className="event-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.name}</h3>
              <p>{event.location}</p>
              <p className="price">₹{event.price}</p>
              <p>{event.available_seats} seats available</p>
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    event_id: event.id,
                  })
                }
              >
                Select Event
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="booking">
        <h2>Book Ticket</h2>

        <form onSubmit={bookTicket}>
          <input
            type="text"
            placeholder="Selected Event ID"
            value={form.event_id}
            onChange={(e) => setForm({ ...form, event_id: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Your Name"
            value={form.customer_name}
            onChange={(e) =>
              setForm({ ...form, customer_name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="number"
            min="1"
            placeholder="Number of Tickets"
            value={form.tickets}
            onChange={(e) => setForm({ ...form, tickets: e.target.value })}
            required
          />

          <button type="submit">Confirm Booking</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="booking-list">
        <h2>Recent Bookings</h2>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings yet.</p>
        ) : (
          <div className="booking-grid">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <h3>{booking.event_name}</h3>
                <p>
                  <strong>Name:</strong> {booking.customer_name}
                </p>
                <p>
                  <strong>Email:</strong> {booking.email}
                </p>
                <p>
                  <strong>Tickets:</strong> {booking.tickets}
                </p>
                <p>
                  <strong>Booked At:</strong>{" "}
                  {new Date(booking.booking_time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;