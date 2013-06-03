

//Function for injecting WOD List  html from loaded WODs
function loadWodListHtml() {

    var wodLookup = ObjectFactory.getWodLookup();

    // Determine if html element exists for injection
    if ($("#wodList").length > 0) {

        var html = "";
        // Iterate through list and create html
        for ( var index in wodLookup) {
            var wod = wodLookup[index];
            html += wod.createListHtml();
        }

        $(html).appendTo("#wodList");
    }

    //Refresh JQM Listview (to apply JQM styling)
    $('#wodList').listview('refresh');
}

//Function for injecting equipment list html
function loadEquipmentListHtml() {

    loadEquipmentLookup();

    // Get EquipmentLookup from object store
    var equipmentLookup = ObjectFactory.getEquipmentLookup();

    // Determine if html element exists for injection
    if ($("#equipmentList").length > 0) {
        var html = "";
        // Iterate through list and create html
        for (var i in equipmentLookup) {
            var eq = equipmentLookup[i];
            html += eq.createListHtml();
        }

        $(html).appendTo("#equipmentList");

        //Refresh JQM Listview (to apply JQM styling)
        $('#equipmentList').listview('refresh');

        // Bind to "click" on the list items
        $(".equipment-clickable").on("click", function () {
            handleEquipmentClick($(this));
        });
    }

}

function loadSingleWodHtml() {

    var id = getIdFromQueryParam();

    if(id != undefined) {
        var wodLookup = ObjectFactory.getWodLookup();
        var wod = wodLookup[id.toString()];

        if(wod != undefined) {

            var tracker = ObjectFactory.getWodTracker();

            //Set href on button
            $("#buttonStartWod").attr("href", "timer.html?id=" + id);

            //Insert exercise html
            var html = wod.createSingleHtml();
            $(html).prependTo("#divExercises");

            //Insert header text
            $('#wodDetailHeader').text(wod.getName().toUpperCase());

            var bestHtml = tracker.getPersonalBestHtml(wod.getName());
            $('#paraPersonalBest').html(bestHtml);

            //Insert history table header
            var noCompleted = tracker.getNoTimesCompleted(wod.getName());
            $('#thNumberCompleted').text('Completed ' + noCompleted + ' times');

            //Insert history table content
            var historyHtml = wod.createHistoryHtml();
            $(historyHtml).appendTo("#historyTableBody");

            $('#wodSingleList').listview('refresh');

        }
    }

}

// Handles a click on a equipment anchor tag
function handleEquipmentClick(anchor) {
    //Find related check mark span
    var span = anchor.children('span');
    var equipmentId = anchor.attr("data-equipmentId");

    //Toggle and determine check mark is visible
    span.toggle();
    var visible = span.is(":visible");

    //Store visibility in localstorage
    Equipment.storeVisibilityInStorage(equipmentId, visible);
}


function getIdFromQueryParam() {
    var query = $(this).data("url");
    if(query != undefined) {
        query = query.split("?");
        if(query.length < 1)
            return undefined;

        query = query[1].replace("id=","");
    }
    else {
        //Handle situations where JQM is not in control (e.q. reload in browser)
        query = window.location.search;
        query = query.replace("?id=","");
    }

    return query;
}

