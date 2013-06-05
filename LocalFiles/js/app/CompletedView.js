define("CompletedView", ["WodTracker", "WodLookup", "HistoryView", "HtmlUtility"],
    function(wodTracker, wodLookupGetter, HistoryView, htmlUtility) {


    var CompletedView = function() {
    }

    CompletedView.prototype = {
        renderCompletedHtml: function() {

            var res = wodLookupGetter.getWodFromQueryParamId();

            if(res != null) {
                var wod = res.wod;

                //Get the just tracked time
                var tracked = wodTracker.getNewest(wod.getName());
                var timeHtml = htmlUtility.formatSecondsAsTime(tracked.time);

                var upperWodName = wod.getName().toUpperCase();

                //Insert header text
                $("#completedHeaderText").text(upperWodName + " completed");

                //Insert body text
                $("#completedText").text(upperWodName + " completed in " + timeHtml);

                //Insert history table content and header
                var historyView = new HistoryView();
                historyView.renderHistoryHtml(wod.getName());
            }
        }
    }

    return CompletedView;
});
