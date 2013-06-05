define("WodView", ["WodLookup", "WodTracker", "HistoryView"],
    function(wodLookupGetter, wodTracker, HistoryView) {

        var WodView = function () {
        };

        WodView.prototype = {

            //Function for injecting WOD List  html from loaded WODs
            renderListHtml: function () {

                var wodLookup = wodLookupGetter.getLookup();

                // Determine if html element exists for injection
                if ($("#wodList").length > 0) {

                    var html = "";
                    // Iterate through list and create html
                    for (var i in wodLookup) {
                        var wod = wodLookup[i];
                        html += this.getSingleItemListHtml(wod);
                    }

                    $(html).appendTo("#wodList");
                }

                //Refresh JQM Listview (to apply JQM styling)
                $('#wodList').listview('refresh');
            },

            renderDetailHtml: function () {

                var wodLookup = wodLookupGetter.getLookup();
                var res = wodLookupGetter.getWodFromQueryParamId();

                if (res != null) {
                    var wod = res.wod;

                    //Set href on button
                    $("#buttonStartWod").attr("href", "timer.html?id=" + res.id);

                    //Insert exercise html
                    var html = this.getDetailHtml(wod);
                    $(html).prependTo("#divExercises");

                    //Insert header text
                    $('#wodDetailHeader').text(wod.getName().toUpperCase());

                    var historyView = new HistoryView();

                    //Insert personal best
                    var bestHtml = historyView.renderPersonalBestHtml(wod.getName());

                    //Insert history table content and header
                    var historyHtml = historyView.renderHistoryHtml(wod.getName());

                    $('#wodSingleList').listview('refresh');
                }

            },

            getDetailHtml: function (wod) {

                var remainingExerciseText = this.addParagraphs(wod.longFormatLines, 1);

                return '<div class="div-single-wod-first-line">' +
                    '<p><span class="timer-icon"></span>' + wod.longFormatLines[0] + '</p>' +
                    '</div>' +
                    '<div class="div-single-wod-exercises">' +
                    remainingExerciseText +
                    '</div>';
            },


            addParagraphs: function (lines, startIndex) {
                var html = "";

                //Insert paragraphs around each exercise but the first line
                for (var i = startIndex; i < lines.length; i++) {
                    var text = lines[i];
                    html += '<p>' + text + '</p>'
                }

                return html;
            },

            getSingleItemListHtml: function (wod) {

                var remainingExerciseText = this.addParagraphs(wod.shortFormatLines, 1);

                //Create html for list element with one-line exercise text
                var html = '<li>' +
                    '<a href="woddetail.html?id=' + wod.wodJson.Id + '"">' +
                    '<h2>' + wod.wodJson.Name + '</h2>' +
                    '<p><i>' + wod.shortFormatLines[0] + '</i></p>' +
                    remainingExerciseText +
                    '</a></li>';

                return html;

            }
        };

        return WodView; //return constructor
    });
