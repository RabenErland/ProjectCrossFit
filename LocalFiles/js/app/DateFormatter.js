function DateFormatter() { }

DateFormatter.dateNames = new Array("Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday");

DateFormatter.monthNames = new Array("January", "February", "March",
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December");

DateFormatter.formatDateAsHtml = function (d) {

    var d_names = DateFormatter.dateNames;
    var m_names = DateFormatter.monthNames;

    var curr_day = d.getDay();
    var curr_date = d.getDate();
    var sup = "";
    if (curr_date == 1 || curr_date == 21 || curr_date == 31) {
        sup = "st";
    }
    else if (curr_date == 2 || curr_date == 22) {
        sup = "nd";
    }
    else if (curr_date == 3 || curr_date == 23) {
        sup = "rd";
    }
    else {
        sup = "th";
    }
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();

    curr_min = curr_min + "";

    if (curr_min.length == 1) {
        curr_min = "0" + curr_min;
    }

    var html = d_names[curr_day] + " " + curr_date + "<SUP>"
        + sup + "</SUP> " + m_names[curr_month] + " " + curr_year + " " +
        curr_hour + ":" + curr_min;

    return html;
};

DateFormatter.formatSecondsAsTime = function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    return minutes + ' min ' + remainingSeconds + ' sec';
};

