

//global variables
const next_month_btn = document.querySelector(".next_month");
const previouse_month_btn = document.querySelector(".prevoius_month");
const next_year_btn = document.querySelector(".next_year");
const previouse_year_btn = document.querySelector(".prevoius_year");

const month_box = document.querySelector(".months");
const selected_month = document.querySelector(".month");
const year_box = document.querySelector(".years");
const selected_year = document.querySelector(".year");

const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let months_counter = 0;
selected_month.textContent = months[0];

function nextMonth() {//for changing the current month to next month
    if (months_counter >= 0 && months_counter < 11) {
        months_counter++;
        selected_month.textContent = months[months_counter];
    }
    else {
        try {//if there is no year available throw a error
            nextYear();
        }
        catch (err) {
            return;
        }
        months_counter = 0;
        selected_month.textContent = months[months_counter];
    }
}
function perviouseMonth() {//changing month to perviouse month
    if (months_counter > 0 && months_counter <= 11) {
        months_counter--;
        selected_month.textContent = months[months_counter];
    }
    else {
        try {//if there is no prevoiuse year
            previouseYear();
        }
        catch (err) {
            return;
        }
        months_counter = 11;
        selected_month.textContent = months[months_counter];
    }
}
function nextYear() {//change year to next year
    let this_year = +selected_year.textContent
    if (this_year >= 1400 && this_year < 1420) {
        this_year++;
        selected_year.textContent = this_year;
    }
    else {
        throw 404;
    }

}
function previouseYear() {//change year to pervoiuse year
    let this_year = +selected_year.textContent
    if (this_year > 1400 && this_year <= 1420) {
        this_year--;
        selected_year.textContent = this_year;
    }
    else {
        throw 404;
    }
}




//events
previouse_month_btn.addEventListener("click", perviouseMonth);
next_month_btn.addEventListener("click", nextMonth);
next_year_btn.addEventListener("click", nextYear);
previouse_year_btn.addEventListener("click", previouseYear);

