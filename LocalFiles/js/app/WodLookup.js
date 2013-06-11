define("WodLookup", ["Wod", "HtmlUtility"], function(Wod, htmlUtility) {

    var wodList;
    $.ajax({
        dataType : "json",
        url : "data/wods.json",
        async : false
    }).done(function(result) {
            wodList = result.wods;
        });

    var wodLookup = []
    $.each(wodList, function(i, wodItem) {
        wodLookup[parseInt(wodItem.Id)] = new Wod(wodItem);
    })


    return {
        getLookup: function()  {
            return wodLookup },

        getWodFromQueryParamId:  function() {
            var id = htmlUtility.getIdFromQueryParam();

            if (id != undefined) {
                var wod = wodLookup[id];
                return {wod: wod, id: id};
            }

            return null;
        },

        getRecommendedWod: function() {

            var i = Math.floor(Math.random()*(wodLookup.length-1)+1);
            console.log("I: " + i)
            return wodLookup[i];
        }

    }
});
