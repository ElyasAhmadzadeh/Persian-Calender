// const express = require("express");
// const cors = require("cors");
// const { calendar } = require("./data");

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// // گرفتن کل دیتا
// app.get("/api/calendar", (req, res) => {
//   res.json(calendar);
// });

// // ثبت تسک روی تاریخ مشخص
// app.post("/api/calendar/:year/:month/:day", (req, res) => {
//   const { year, month, day } = req.params;
//   const { task } = req.body;

//   const yearIndex = year - 1400;
//   const monthIndex = month - 1;
//   const dayIndex = day - 1;

//   if (
//     calendar[yearIndex] &&
//     calendar[yearIndex][monthIndex] &&
//     calendar[yearIndex][monthIndex][dayIndex]
//   ) {
//     calendar[yearIndex][monthIndex][dayIndex].tasks.push(task);
//     res.status(200).json({ message: "Task added successfully" });
//   } else {
//     res.status(404).json({ error: "Invalid date" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });



const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dayNames = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]; // شمسی: فروردین تا اسفند

// تولید تقویم کامل از ۱۴۰۰ تا ۱۴۲۰
const calendar = [];
let currentDayIndex = 0;

for (let year = 1400; year <= 1420; year++) {
  const months = [];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = monthDays[month];
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        dayName: dayNames[currentDayIndex % 7],
        tasks: []
      });
      currentDayIndex++;
    }

    months.push(days);
  }

  calendar.push(months);
}

// 📤 گرفتن کل تقویم
app.get("/api/calendar", (req, res) => {
  res.json(calendar);
});

// 📥 افزودن تسک جدید به یک روز خاص
app.post("/api/tasks/:year/:month/:day", (req, res) => {
  const { year, month, day } = req.params;
  const { task } = req.body;

  const yearIndex = year - 1400;
  const monthIndex = month - 1;
  const dayIndex = day - 1;

  if (
    !calendar[yearIndex] ||
    !calendar[yearIndex][monthIndex] ||
    !calendar[yearIndex][monthIndex][dayIndex]
  ) {
    return res.status(400).json({ error: "Invalid date" });
  }

  calendar[yearIndex][monthIndex][dayIndex].tasks.push(task);
  res.status(201).json({
    message: "Task added successfully",
    day: calendar[yearIndex][monthIndex][dayIndex]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
