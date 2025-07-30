const express = require("express");
const cors = require("cors");
const { calendar } = require("./data");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// گرفتن کل دیتا
app.get("/api/calendar", (req, res) => {
  res.json(calendar);
});

// ثبت تسک روی تاریخ مشخص
app.post("/api/calendar/:year/:month/:day", (req, res) => {
  const { year, month, day } = req.params;
  const { task } = req.body;

  const yearIndex = year - 1400;
  const monthIndex = month - 1;
  const dayIndex = day - 1;

  if (
    calendar[yearIndex] &&
    calendar[yearIndex][monthIndex] &&
    calendar[yearIndex][monthIndex][dayIndex]
  ) {
    calendar[yearIndex][monthIndex][dayIndex].tasks.push(task);
    res.status(200).json({ message: "Task added successfully" });
  } else {
    res.status(404).json({ error: "Invalid date" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
