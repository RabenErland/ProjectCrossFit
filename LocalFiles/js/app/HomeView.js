define("HomeView", ["HistoryView", "WodView", "WodLookup"], function(HistoryView, WodView, wodLookupGetter) {

    var HomeView = function () {
    }

    HomeView.prototype = {
        renderHomeHtml: function() {
            //get recommended WOD and render recommendation
            var wodId = this.reloadRecommendation();

            //render latest WODs
            var historyView = new HistoryView();
            historyView.renderHistoryHtml(10);

            return wodId;
        },

        reloadRecommendation: function() {
            //get recommended WOD and render recommendation
            var wod = wodLookupGetter.getRecommendedWod();

            if(wod === null || wod === undefined) {
                var i = 01;
            }


            console.log("ID: " + wod.wodJson.Id)



            var wodView = new WodView();
            var html = wodView.getDetailHtml(wod, true);

            var old = $("#recommendWod").hide();
            $("#recommendWod").html(html);
            $('#recommendWod').fadeIn("fast");

            return wod.wodJson.Id;
        },

        sendToWodPage: function(wodId) {
            $.mobile.changePage("woddetail.html?id=" + wodId);
        }
    }


    return HomeView;

});








