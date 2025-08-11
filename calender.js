

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
const delete_btn = document.querySelectorAll(".delete");
const worksInDay = document.querySelectorAll(".works_count");
const table = document.querySelector(".days_in_month_table");
const day_show = document.querySelector(".day_show");
const month_show = document.querySelector(".month_show");
const year_show = document.querySelector(".year_show");

const month_box = document.querySelector(".months");
const selected_month = document.querySelector(".month");
const year_box = document.querySelector(".years");
const selected_year = document.querySelector(".year");

const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let months_counter = 0;
selected_month.textContent = months[0];



calenderUpdate();//updating the calender when the page was load


function dateObject() {//return an object for selected date
    const month = document.querySelector(".month").textContent;
    const monthNumber = monthToNumber(month);
    const year = +document.querySelector(".year").textContent;

    return {
        month: month,
        month_number: monthNumber,
        year: year
    }
}

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
    }//update the page informations
    dateShow();
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
    }//update the page informations
    dateShow();
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
    }//update the page informations
    dateShow();
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
    }//update the page informations
    dateShow();
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
const textAreaHandler = () => {//check the input characters in textarea
    let txtCharacters = 150;
    const typedCharacters = textarea.value.length;
    const overallCharacters = txtCharacters - typedCharacters;
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


function monthToNumber(month) {//turn the month name into month number in array
    for (let i = 0; i < months.length; i++) {
        if (months[i] == month) {
            return i;
        }
    }
}



function calenderUpdate() {//get the calender information from server and put it on page
    fetch(getURL)
        .then(res => {
            return res.json()
        })
        .then(
            data => {
                console.log(data);

                const date = dateObject();

                const daysInMonth = data[date.year - 1400][date.month_number];


                for (let i = 0; i < day.length; i++) {
                    day[i].textContent = "";
                    worksInDay[i].textContent = "";
                }



                let newj = 0;
                for (let i = 0; i < daysInMonth.length; i++) {
                    for (let j = newj; j < day.length; j++) {
                        if (day[j].classList.contains(daysInMonth[i].dayName) && day[j].textContent == "") {
                            day[j].textContent = daysInMonth[i].day;
                            // if (day[j].textContent != "") {
                            worksInDay[j].textContent = daysInMonth[i].tasks.length;
                            console.log(daysInMonth[i].tasks.length);
                            // }
                            newj = j;
                            break;
                        }
                    }
                }

            }
        );
}



function postToServer(event) {//post informtions to server
    event.preventDefault();
    const task = textarea.value;

    const date = dateObject();

    if (selectedDay == null || selectedDay == "") {
        alert("please select a day");
        return;
    }

    fetch(`http://localhost:3000/api/tasks/${date.year}/${date.month_number + 1}/${selectedDay}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ task: task })
    })
        .then(res => {
            if (res.ok) {
                console.log("put method success");
                textarea.value = "";
                makeList();
                calenderUpdate();
            }
            else {
                console.log("put method failed");
                return;
            }
        })
        .catch(err => {
            console.log(err);
        });
    characterCounter.textContent = 150;
    calenderUpdate();
}

function makeList() {//displaying today's works
    const last_list_itmes = document.querySelectorAll(".work");
    last_list_itmes.forEach(
        element => {
            element.remove();
        }
    )


    const date = dateObject();
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
                console.log(data);

                tasks = data[date.year - 1400][date.month_number][selectedDay - 1].tasks;
                let task_counter = 0;
                tasks.forEach(
                    todayTask => {
                        task_counter++;
                        let workElement;
                        if (todayTask.done == true) {

                            workElement = `<li class="work">
    <div class = "task_number">task  <span class = "task_counter">${task_counter}</span></div>
    <div class = "task_status_done">task done</div>
<div class="work_txt done_work">
    <p>
    ${todayTask.text}
    </p>
</div>
<div class="buttons">
    <button class="done"><i class="fa fa-check" aria-hidden="true"></i></button>
    <button class="delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
</div>
</li>`;
                        }
                        if (todayTask.done == false) {
                            workElement = `<li class="work">
    <div class = "task_number">task  <span class = "task_counter">${task_counter}</span></div>
    <div class = "task_status_not_done">task isn't done</div>
<div class="work_txt">
    <p>
    ${todayTask.text}
    </p>
</div>
<div class="buttons">
    <button class="done"><i class="fa fa-check" aria-hidden="true"></i></button>
    <button class="delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
</div>
</li>`;
                        }


                        if (workElement != null)
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

function dateShow() {//show selected day
    const date = dateObject();
    day_show.textContent = selectedDay;
    month_show.textContent = date.month_number + 1;
    year_show.textContent = date.year - 1400;
}

function sellSelected(event) {//when user selected a day cell in table

    const clickedEL = event.target;
    if (clickedEL.classList.contains("day_number")) {
        selectedDay = clickedEL.textContent;
    }
    else if (clickedEL.classList.contains("works_count")) {
        const selected_sell = clickedEL.closest(".day");
        selectedDay = selected_sell.querySelector(".day_number").textContent;
    }

    dateShow();

    day_sells.forEach(//removing styles from other cells
        element => {
            element.classList.remove("selected_day_animation");
        }
    )
    clickedEL.closest(".day").classList.add("selected_day_animation");
    dayContainer.classList.add("selected-day-loading");
    makeList();

}

function deleteThisTask(event) {//function for deleting the selected task from api and server and refresh the tasks list
    const clickedEl = event.target;
    const date = dateObject();


    if (clickedEl.classList.contains("delete") || clickedEl.classList.contains("fa-trash")) {
        const work_card = clickedEl.closest(".work");
        const task_number = +work_card.querySelector(".task_counter").textContent;

        fetch(`http://localhost:3000/api/tasks/${date.year}/${date.month_number}/${selectedDay}/${task_number - 1}`,
            {
                method: "DELETE"
            }
        )
            .then(
                res => {
                    if (res.ok) {
                        console.log("item deleted successfully");
                        makeList();
                    }
                    else {
                        console.log("can't delete item");

                    }
                }
            )
            .catch()
        {
            err => {
                console.log("Error : " + err);
            }
        }

    }

}
function workDoneCheck(event) {//function for done the selected task from api and server and refresh the tasks list
    const clickedEl = event.target;
    const date = dateObject();


    if (clickedEl.classList.contains("done") || clickedEl.classList.contains("fa-check")) {
        const work_card = clickedEl.closest(".work");
        const work_number = +work_card.querySelector(".task_counter").textContent;


        fetch(`http://localhost:3000/api/tasks/${date.year}/${date.month_number + 1}/${selectedDay}/${work_number - 1}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ done: true })
        })
            .then(
                res => {
                    if (res.ok) {
                        console.log("done successfully");
                        makeList();
                    }
                    else {
                        console.log("done failed");

                    }
                }
            )
            .catch(
                err => {
                    console.log("Error : " + err);

                }
            )


    }
}



function errorWorks() {//error function for when the api informations wasn't loading
    list.textContent = "خطای سرور";
    list.style.color = "red";
}
function keypressFormHandler(event) {
    console.log(event.key);

    if (event.key === "Enter")
        postToServer(event);

}

//events
table.addEventListener("click", sellSelected);
list.addEventListener("click", workDoneCheck);
list.addEventListener("click", deleteThisTask);
form.addEventListener("keydown", keypressFormHandler);
form.addEventListener("submit", postToServer);
previouse_month_btn.addEventListener("click", perviouseMonth);
next_month_btn.addEventListener("click", nextMonth);
next_year_btn.addEventListener("click", nextYear);
previouse_year_btn.addEventListener("click", previouseYear);
textarea.addEventListener("focus", textAreaClean);
textarea.addEventListener("blur", textAreaReset);
textarea.addEventListener("input", textAreaHandler);
