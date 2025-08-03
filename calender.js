// const { log } = require("console");






//global variables
const next_month_btn = document.querySelector(".next_month");
const previouse_month_btn = document.querySelector(".prevoius_month");
const next_year_btn = document.querySelector(".next_year");
const previouse_year_btn = document.querySelector(".prevoius_year");
const textarea = document.querySelector(".user_input_textarea");
const characterCounter = document.querySelector(".character_count");
const day = document.querySelectorAll(".day_number");
const form = document.querySelector(".work_user_input");
const day_sells = document.querySelectorAll(".day");
let selectedDay = null;
const dayContainer = document.querySelector(".selected-day");
const list = document.querySelector(".works_list");
const getURL = `http://localhost:3000/api/calendar/`;



const month_box = document.querySelector(".months");
const selected_month = document.querySelector(".month");
const year_box = document.querySelector(".years");
const selected_year = document.querySelector(".year");

const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let months_counter = 0;
selected_month.textContent = months[0];



calenderUpdate();


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
    calenderUpdate();
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
    calenderUpdate();
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
    calenderUpdate();
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
    calenderUpdate();
}

function textAreaClean() {
    const txt_area_lable = document.querySelector(".textarea_guide");
    txt_area_lable.style.opacity = "0";

}
function textAreaReset() {
    if (textarea.value == "") {
        const txt_area_lable = document.querySelector(".textarea_guide");
        txt_area_lable.style.opacity = "1";
    }


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


function monthToNumber(month) {
    for (let i = 0; i < months.length; i++) {
        if (months[i] == month) {
            return i;
        }
    }
}



function calenderUpdate() {
    fetch(getURL)
        .then(res => {
            return res.json()
        })
        .then(
            data => {
                console.log(data);

                const month = document.querySelector(".month").textContent;
                const year = document.querySelector(".year").textContent;
                const yearNumber = +year;
                let monthNumber = monthToNumber(month);

                const daysInMonth = data[yearNumber - 1400][monthNumber];


                for (let i = 0; i < day.length; i++) {
                    day[i].textContent = "";
                }



                let newj = 0;
                for (let i = 0; i < daysInMonth.length; i++) {
                    for (let j = newj; j < day.length; j++) {
                        if (day[j].classList.contains(daysInMonth[i].dayName) && day[j].textContent == "") {
                            day[j].textContent = daysInMonth[i].day;
                            newj = j;
                            break;
                        }
                    }
                }

            }
        );
}



function postToServer() {
    const task = textarea.value;
    const month = document.querySelector(".month").textContent;
    const monthNumber = monthToNumber(month);
    const year = +document.querySelector(".year").textContent;
    if (selectedDay == null) {
        alert("please select a day");
        return;
    }

    fetch(`http://localhost:3000/api/tasks/${year}/${monthNumber + 1}/${selectedDay}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ task: task })
    })
        .then(res => {
            if (res.ok) {
                console.log("success");
                makeList();
            }
        })
        .catch(err => {
            console.log(err);
        });


}

function makeList() {




    const month = document.querySelector(".month").textContent;
    const monthNumber = monthToNumber(month);
    const year = +document.querySelector(".year").textContent;
    let tasks = [];
    let tasks_txt = [];
    fetch(getURL)
        .then(res => {
            if (!res.ok) {
                errorWorks();
                return;
            }

            if (list.textContent == "خطای سرور") {
                list.textContent = "";
                list.style.color = "black";
            }
            return res.json()
        })
        .then(
            data => {
                tasks = data[year - 1400][monthNumber][selectedDay - 1].tasks;
                tasks.forEach(
                    task => {
                        tasks_txt.push(task.text);
                    }
                )

                tasks_txt.forEach(
                    text => {
                        console.log("text found");

                        const workElement = `<li class="work">
                    <div class="work_txt">
                        <p>
                        ${text}
                        </p>
                    </div>
                    <div class="buttons">
                        <button class="done"><i class="fa fa-check" aria-hidden="true"></i></button>
                        <button class="delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                </li>`;

                        list.insertAdjacentHTML("afterbegin", workElement);
                    }
                )

            }

        )
        .catch(
            err => {
                console.log(err);
            }
        );
    console.log(tasks_txt);







}

function sellSelected(event) {


    day_sells.forEach(
        element => {
            element.classList.remove("selected_day_animation");
        }
    )
    const selected = event.target;
    selectedDay = selected.closest(".day_number").textContent;


    selected.closest(".day").classList.add("selected_day_animation");
    dayContainer.classList.add("selected-day-loading");
    makeList();


}

function errorWorks() {
    list.textContent = "خطای سرور";
    list.style.color = "red";
}



//events
day_sells.forEach(
    element => {
        element.addEventListener("click", sellSelected)
    }
)
form.addEventListener("submit", postToServer);
form.addEventListener("submit", makeList);
previouse_month_btn.addEventListener("click", perviouseMonth);
next_month_btn.addEventListener("click", nextMonth);
next_year_btn.addEventListener("click", nextYear);
previouse_year_btn.addEventListener("click", previouseYear);
textarea.addEventListener("focus", textAreaClean);
textarea.addEventListener("blur", textAreaReset);
textarea.addEventListener("input", textAreaHandler);
