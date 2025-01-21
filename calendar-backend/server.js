const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Mockovaná data událostí
const events = [
  { id: 1, date: "2025-01-22", time: "10:00", title: "Ranní jóga", description: "Začněte den s lehkou a příjemnou jógou.", img: "images/sauna.jpg" },
  { id: 2, date: "2025-01-24", time: "18:00", title: "Saunový ceremoniál", description: "Relaxace a očista v příjemném prostředí sauny.", img: "images/sauna.jpg" },
  { id: 3, date: "2025-01-25", time: "20:00", title: "Večerní relaxace", description: "Ideální zakončení týdne v klidném prostředí.", img: "images/sauna.jpg" },
];

// Endpoint pro získání událostí podle data
app.get("/api/events", (req, res) => {
  const { startDate, endDate } = req.query;
  const filteredEvents = events.filter(
    (event) =>
      (!startDate || new Date(event.date) >= new Date(startDate)) &&
      (!endDate || new Date(event.date) <= new Date(endDate))
  );
  res.json(filteredEvents);
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
