define("WodLookup", ["Wod", "HtmlUtility"], function(Wod, htmlUtility) {

    var wodList;
    $.ajax({
        dataType : "json",
        url : "data/wods.json",
        async : false
    }).done(function(result) {
            wodList = result.wods;
        });

    var wodLookup = {}
    $.each(wodList, function(i, wodItem) {
        wodLookup[wodItem.Id] = new Wod(wodItem);
    })


    return {
        getLookup: function()  {
            return wodLookup },

        getWodFromQueryParamId:  function() {
            var id = htmlUtility.getIdFromQueryParam();

            if (id != undefined) {
                var wod = wodLookup[id.toString()];
                return {wod: wod, id: id};
            }

            return null;
        }
    }
});
