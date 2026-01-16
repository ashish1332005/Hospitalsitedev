$(document).ready(function () {
    let selectedDates = [];

    $("#availableDates").datepicker({
        dateFormat: "yy-mm-dd",
        beforeShowDay: function (date) {
            let dateString = $.datepicker.formatDate("yy-mm-dd", date);
            return [true, selectedDates.includes(dateString) ? "selected-date" : ""];
        },
        onSelect: function (dateText) {
            let index = selectedDates.indexOf(dateText);
            if (index > -1) {
                selectedDates.splice(index, 1);
            } else {
                selectedDates.push(dateText);
            }
            $(this).val(selectedDates.join(", "));
        }
    });

    $("#selectAllDates").click(function () {
        let today = new Date();
        selectedDates = [];

        for (let i = 0; i < 30; i++) {
            let nextDate = new Date();
            nextDate.setDate(today.getDate() + i);
            selectedDates.push($.datepicker.formatDate("yy-mm-dd", nextDate));
        }

        $("#availableDates").val(selectedDates.join(", "));
    });

    $("head").append(`
        <style>
            .selected-date a { 
                background-color: #007bff !important; 
                color: white !important; 
                border-radius: 50%;
            }
        </style>
    `);

    // Form Validation
    $("#submitBtn").click(function (e) {
        if (!validateForm()) {
            e.preventDefault();
            $("#output").text("Please ensure all fields are valid.").addClass("text-danger");
        }
    });
});

function validateForm() {
    const startHour = parseInt(document.getElementById("startHour").value);
    const endHour = parseInt(document.getElementById("endHour").value);
    const startAMPM = document.getElementById("startAMPM").value;
    const endAMPM = document.getElementById("endAMPM").value;

    if (document.getElementById("availableDates").value.trim() === "") {
        return false;
    }

    if (startAMPM === endAMPM && startHour > endHour) {
        return false;
    }

    getTimePeriod();
    return true;
}

function getTimePeriod() {
    let startHour = document.getElementById("startHour").value;
    let startMinute = document.getElementById("startMinute").value;
    let startAMPM = document.getElementById("startAMPM").value;
    let endHour = document.getElementById("endHour").value;
    let endMinute = document.getElementById("endMinute").value;
    let endAMPM = document.getElementById("endAMPM").value;

    let timePeriod = `${startHour}:${startMinute} ${startAMPM} - ${endHour}:${endMinute} ${endAMPM}`;
    document.getElementById("formattedTime").value = timePeriod;
    document.getElementById("output").textContent = `Selected Time: ${timePeriod}`.replace("text-danger", "text-secondary");
}