const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(require('cors')());

// دیتای اصلی
let calendarData = [...]; // اینجا همون دیتایی که بالا ساختی میاد

// گرفتن تسک‌های یک روز خاص
app.get('/tasks/:year/:month/:day', (req, res) => {
  const { year, month, day } = req.params;
  const yearData = calendarData.find(y => y.year == year);
  const monthData = yearData?.months.find(m => m.month == month);
  const dayData = monthData?.days.find(d => d.day == day);

  if (dayData) res.json(dayData.tasks);
  else res.status(404).json({ error: "Date not found" });
});

// افزودن یک تسک به یک روز خاص
app.post('/tasks/:year/:month/:day', (req, res) => {
  const { year, month, day } = req.params;
  const { task } = req.body;

  const yearData = calendarData.find(y => y.year == year);
  const monthData = yearData?.months.find(m => m.month == month);
  const dayData = monthData?.days.find(d => d.day == day);

  if (dayData) {
    dayData.tasks.push(task);
    res.json({ success: true, tasks: dayData.tasks });
  } else {
    res.status(404).json({ error: "Date not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
