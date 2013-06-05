define("HtmlUtility", [], function() {

    var singleton = function () {
        return {
            dateNames: new Array("Sunday", "Monday", "Tuesday",
                "Wednesday", "Thursday", "Friday", "Saturday"),

            monthNames: new Array("January", "February", "March",
                "April", "May", "June", "July", "August", "September",
                "October", "November", "December"),

            formatDateAsHtml: function (d) {

                var d_names = this.dateNames;
                var m_names = this.monthNames;

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

                return d_names[curr_day] + " " + curr_date + "<SUP>"
                    + sup + "</SUP> " + m_names[curr_month] + " " + curr_year + " " +
                    curr_hour + ":" + curr_min;
            },

            formatSecondsAsTime: function (seconds) {
                var minutes = Math.floor(seconds / 60);
                var remainingSeconds = seconds % 60;

                return minutes + ' min ' + remainingSeconds + ' sec';
            },

            getIdFromQueryParam: function () {
                var query = $(this).data("url");
                if (query != undefined) {
                    query = query.split("?");
                    if (query.length < 1)
                        return undefined;

                    query = query[1].replace("id=", "");
                }
                else {
                    //Handle situations where JQM is not in control (e.q. reload in browser)
                    query = window.location.search;
                    query = query.replace("?id=", "");
                }

                return query;
            }
        }
    };

    return singleton();
});





