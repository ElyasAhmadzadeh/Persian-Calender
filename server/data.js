const jalaali = require("jalaali-js");

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const createCalendarData = () => {
  const calendarData = [];

  for (let year = 1400; year <= 1420; year++) {
    const yearData = [];

    for (let month = 1; month <= 12; month++) {
      const daysInMonth =
        month <= 6 ? 31 : month <= 11 ? 30 : 29;

      const monthData = [];
      for (let day = 1; day <= daysInMonth; day++) {
        // تبدیل تاریخ شمسی به میلادی
        const { gy, gm, gd } = jalaali.toGregorian(year, month, day);
        const weekdayIndex = new Date(gy, gm - 1, gd).getDay(); // getDay عدد بین 0-6 برمی‌گردونه
        const weekdayName = weekdays[weekdayIndex];

        monthData.push({
          day,
          weekday: weekdayName,
          tasks: []
        });
      }

      yearData.push(monthData);
    }

    calendarData.push(yearData);
  }

  return calendarData;
};

const calendar = createCalendarData();

module.exports = { calendar };
