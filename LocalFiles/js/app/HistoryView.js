define("HistoryView", ["HtmlUtility", "WodTracker"], function(htmlUtility, wodTracker) {

    var HistoryView = function() {}

    HistoryView.prototype = {
        renderHistoryHtml: function(noRecords) {

            //insert table content
            var historyHtml = this.getHistoryHtml(noRecords);

            var tableHtml =
                '<table data-role="none" class="table-stroke ui-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Recently completed</th>' +
                            '<th></th>' +
                            '<th></th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody id="historyTableBody">' +
                        historyHtml +
                    '</tbody>' +
                '</table>'

            $('#historyTableDiv').html(tableHtml);
        },

        renderWodHistoryHtml: function(wodName) {

            var noCompleted = wodTracker.getNoTimesCompleted(wodName);
            var headerText = 'Completed ' + noCompleted + (noCompleted == 1 ? ' time' : ' times');

            //insert table content
            var historyHtml = this.getWodHistoryHtml(wodName);

            var tableHtml =
                '<table data-role="none" class="table-stroke ui-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th class="first-column"></th>' +
                            '<th id="thNumberCompleted">' + headerText + '</th>' +
                            '<th></th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody id="historyTableBody">' +
                        historyHtml +
                    '</tbody>' +
                '</table>'

            $('#wodHistoryTableDiv').html(tableHtml);
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

        getHistoryHtml: function(noRecords) {
            var records = wodTracker.getWodRecordList(noRecords);

            var html = "";
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                var wodName = record.wodName;
                var dateHtml = htmlUtility.formatDateAsHtml(new Date(record.dateCompleted));
                var timeHtml = htmlUtility.formatSecondsAsTime(record.time);

                html +=
                    '<tr>' +
                        '<td>' + dateHtml + '</td>' +
                        '<td style="text-align: left"><strong>' +  wodName + '</strong></td>' +
                        '<td>' + timeHtml + '</td>' +
                    '</tr>';
            }

            return html;
        },

        getWodHistoryHtml: function (wodName) {

            var records = wodTracker.getWodRecordsPerName(wodName);

            var html = "";

            for (var i = 0; i < records.length; i++) {
                var record = records[i];

                var dateHtml = htmlUtility.formatDateAsHtml(new Date(record.dateCompleted));
                var timeHtml = htmlUtility.formatSecondsAsTime(record.time);

                var isBest = wodTracker.isPersonalBest(record);

                html +=
                    '<tr>' +
                        '<td class="first-column">' + (isBest ? '<span class="badge-icon"></span>' : '') + '</td>' +
                        '<td>' + dateHtml + '</td>' +
                        '<td>' + timeHtml + '</td>' +
                        '</tr>';

            }
            return html;
        }
    };

    return HistoryView;
});
