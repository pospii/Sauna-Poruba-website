const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Funkce pro načtení událostí z textového souboru
function loadEventsFromFile() {
  const filePath = path.join(__dirname, "events.txt");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const events = fileContent
    .trim()
    .split("\n")
    .map((line) => {
      const [date, time, title, description, img] = line.split(";");
      return { date, time, title, description, img };
    });
  return events;
}

// Endpoint pro získání událostí podle data
app.get("/api/events", (req, res) => {
  const { startDate, endDate } = req.query;

  // Načtení událostí z textového souboru
  const events = loadEventsFromFile();

  // Filtrování událostí podle data
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
