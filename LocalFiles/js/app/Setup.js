/** SETUP CALLS **/
setupEventhandlers();
loadEquipmentLookup();
loadWodLookup();
createTestData();


/* SETUP FUNCTIONS - bind to pagecreate and key events */
function setupEventhandlers() {
    // Bind to pagebeforecreate on wods and equipment
        $(document).on("pagebeforeshow", "#wodPage", function () {
            loadWodListHtml();
        });

        $(document).on("pagebeforeshow", "#equipmentPage", function () {
            loadEquipmentListHtml();
        });


        $(document).on("pagebeforeshow", "#woddetailPage", function () {
            loadSingleWodHtml();
        });

        //Setup timer
        $(document).on("pagebeforeshow", "#timerPage", function () {

            var timer = new Timer();

            //Bind to click
            $("#spanPauseResume").click(function() {
                timer.handlePauseResume();
            });
        });

        // Bind to mobile back button - go back or close app depending on active page
        document.addEventListener("backbutton", function() {
            handleBackButton();
        }, true);



        /* END OF - SETUP FUNCTIONS */
    }


// Loads wods from JSON and stores them as an object lookup
function loadWodLookup() {

    var wodLookup = ObjectFactory.getWodLookup();
    if(wodLookup != undefined)
        return wodLookup;

    var wodList;
    $.ajax({
        dataType : "json",
        url : "data/wods.json",
        async : false
    }).done(function(result) {
        wodList = result.wods;
    });

    wodLookup = {};
    $.each(wodList, function(i, wodItem) {
        wodLookup[wodItem.Id] = new Wod(wodItem);
    });

    ObjectFactory.storeWodLookup(wodLookup);
    return wodLookup;
}


//Loads equipments from JSON and stores them as an object lookup
function loadEquipmentLookup() {
    var equipmentLookup = ObjectFactory.getEquipmentLookup();
    if(equipmentLookup != undefined)
        return equipmentLookup;

    var equipmentList;
    $.ajax({
        dataType : "json",
        url : "data/equipment.json",
        async : false
    }).done(function(result) {
        equipmentList = result.equipment;
    });

    equipmentLookup = {};
    $.each(equipmentList, function(i, equipmentItem) {
        equipmentLookup[equipmentItem.Id] = new Equipment(equipmentItem);
    });

    ObjectFactory.storeEquipmentLookup(equipmentLookup);
    return equipmentLookup;
}

function handleBackButton() {
    var activepage = $.mobile.activePage;
    var menupanel = $.mobile.activePage.find("#menupanel");

    if (menupanel != undefined && menupanel.css("visibility") != "hidden") {
        menupanel.panel("close");
    } else if (activepage.attr("id") == "home") {
        mosync.app.exit();
    } else {
        $.mobile.back();
    }
}

function createTestData() {
    WodTracker.clearStorage();

    var tracker = WodTracker.getTracker();
    var s =  new Date(2013, 4, 28, 10, 36, 1, 10).toString();
    tracker.addWodRecord("Fran", new Date(2013, 4, 28, 10, 36, 1, 10).getTime(), 405);
    tracker.addWodRecord("Fran", new Date(2012, 2, 4, 10, 20, 1, 9).getTime(), 109);

    tracker.addWodRecord("Karen", new Date().getTime(), 203);
    tracker.addWodRecord("Karen", new Date(2012, 5, 5, 5, 5, 5, 5).getTime(), 202);
}




