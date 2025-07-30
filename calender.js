

//global variables
const next_month_btn = document.querySelector(".next_month");
const previouse_month_btn = document.querySelector(".prevoius_month");
const next_year_btn = document.querySelector(".next_year");
const previouse_year_btn = document.querySelector(".prevoius_year");
const textarea = document.querySelector(".user_input_textarea");
const characterCounter = document.querySelector(".character_count");

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

function textAreaClean() {
    const txt_area_lable = document.querySelector(".textarea_guide");
    txt_area_lable.style.opacity = "0";

}
function textAreaReset() {
    const txt_area_lable = document.querySelector(".textarea_guide");
    txt_area_lable.style.opacity = "1";

}
const textAreaHandler = () => {
    let txtCharacters = 150;
    const typedCharacters = textarea.value.length;
    const overallCharacters = +txtCharacters - typedCharacters;
    characterCounter.textContent = overallCharacters;

    if (overallCharacters <= 50 && overallCharacters > 10) {
        characterCounter.style.color = "orange";
    }
    else if (overallCharacters <= 10) {
        characterCounter.style.color = "red";
    }
    else {
        characterCounter.style.color = "rgba(255, 255, 255, 0.701)";
    }


}




//events
previouse_month_btn.addEventListener("click", perviouseMonth);
next_month_btn.addEventListener("click", nextMonth);
next_year_btn.addEventListener("click", nextYear);
previouse_year_btn.addEventListener("click", previouseYear);
textarea.addEventListener("focus", textAreaClean);
textarea.addEventListener("blur", textAreaReset);
textarea.addEventListener("input", textAreaHandler);
