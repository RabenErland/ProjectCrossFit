define("HistoryView", ["HtmlUtility", "WodTracker"], function(htmlUtility, wodTracker) {

    var HistoryView = function() {}

    HistoryView.prototype = {
        renderHistoryHtml: function(wodName) {
            //Insert history table header
            var noCompleted = wodTracker.getNoTimesCompleted(wodName);
            $('#thNumberCompleted').text('Completed ' + noCompleted + (noCompleted == 1 ? 'time' : ' times'));

            //insert table content
            var historyHtml = this.getHistoryHtml(wodName);
            $(historyHtml).appendTo("#historyTableBody");
        },

        renderPersonalBestHtml: function(wodName) {
            var bestHtml = this.getPersonalBestHtml(wodName);
            $('#paraPersonalBest').html(bestHtml);
        },

        getPersonalBestHtml: function(wodName) {
            var personalBest = wodTracker.getPersonalBest(wodName);

            var bestText;
            if(personalBest != null) {
                bestText = "Personal best: " + htmlUtility.formatSecondsAsTime(personalBest);
            }
            else {
                bestText = "You do not have a personal best yet"
            }

            return '<span class="badge-icon"></span>' + bestText;
        },

        getHistoryHtml: function (wodName) {

            var records = wodTracker.getWodRecordsPerName(wodName);

            var html = "";

            for (var i = 0; i < records.length; i++) {
                var record = records[i];

                var date = new Date(record.dateCompleted);
                var dateHtml = htmlUtility.formatDateAsHtml(date);
                var timeHtml = htmlUtility.formatSecondsAsTime(record.time);

                var isBest = wodTracker.isPersonalBest(record);

                html +=
                    '<tr>' +
                        '<td class="first-column">' + (isBest ? '<span class="badge-icon"></span>' : '') + '</td>' +
                        '<td>' + dateHtml + '</td>' +
                        '<td>' + timeHtml + '</td>' +
                        '<tr>';

            }
            return html;
        }
    };

    return HistoryView;
});
