




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

app.put("/api/tasks/:year/:month/:day/:taskIndex", (req, res) => {
  const { year, month, day, taskIndex } = req.params;
  const { done } = req.body;

  const yearIndex = year - 1400;
  const monthIndex = month - 1;
  const dayIndex = day - 1;
  const taskIdx = parseInt(taskIndex);

  const dayObj = calendar[yearIndex]?.[monthIndex]?.[dayIndex];

  if (!dayObj || isNaN(taskIdx) || taskIdx >= dayObj.tasks.length) {
    return res.status(400).json({ error: "Invalid task" });
  }

  dayObj.tasks[taskIdx].done = !!done;
  res.json({ message: "Task updated", task: dayObj.tasks[taskIdx] });
});


  app.delete("/api/tasks/:year/:month/:day/:taskIndex", (req, res) => {
    const { year, month, day, taskIndex } = req.params;

    const yearIndex = year - 1400;
    const monthIndex = month;
    const dayIndex = day - 1;

    const dayObj = calendar[yearIndex]?.[monthIndex]?.[dayIndex];
    if (!dayObj) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const index = parseInt(taskIndex, 10);
    if (isNaN(index) || index < 0 || index >= dayObj.tasks.length) {
      return res.status(400).json({ error: "Invalid task index" });
    }

    // حذف تسک
    dayObj.tasks.splice(index, 1);

    res.status(200).json({
      message: "Task deleted successfully",
      day: dayObj
    });
  });


  // اطمینان حاصل می‌کنیم که task یک رشته هست
  if (typeof task !== "string" || !task.trim()) {
    return res.status(400).json({ error: "Task must be a non-empty string" });
  }

  const taskObject = {
    text: task,
    done: false
  };

  calendar[yearIndex][monthIndex][dayIndex].tasks.push(taskObject);
  res.status(201).json({
    message: "Task added successfully",
    day: calendar[yearIndex][monthIndex][dayIndex]
  });
});


app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});



// app.post("/api/tasks/:year/:month/:day", (req, res) => {
//   const { year, month, day } = req.params;
//   const { task } = req.body;

//   const yearIndex = year - 1400;
//   const monthIndex = month - 1;
//   const dayIndex = day - 1;

//   if (
//     !calendar[yearIndex] ||
//     !calendar[yearIndex][monthIndex] ||
//     !calendar[yearIndex][monthIndex][dayIndex]
//   ) {
//     return res.status(400).json({ error: "Invalid date" });
//   }

//   calendar[yearIndex][monthIndex][dayIndex].tasks.push(task);
//   res.status(201).json({
//     message: "Task added successfully",
//     day: calendar[yearIndex][monthIndex][dayIndex]
//   });
// });