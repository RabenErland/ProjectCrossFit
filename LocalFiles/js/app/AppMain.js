define("AppMain", ["HomeView", "EquipmentView", "WodView", "TimerView", "TabataTimerView", "CompletedView", "WodTracker"],
    function(HomeView, EquipmentView, WodView, TimerView, TabataTimerView, CompletedView, wodTracker) {
    var singleton = function () {
        return {

            initialize: function () {
                //Call setup functions
                this.setupEventhandlers();
                this.createTestData();

                //Initialize the first page
                $.mobile.initializePage();
            },

            //Private function for setting up eventhandlers
            setupEventhandlers: function () {
                $(document).on("pagecreate", "#home",  function () {
                    var homeView = new HomeView();
                    var wodId;
                    wodId = homeView.renderHomeHtml();

                    $("#reloadButton").click(function(e) {
                       wodId = homeView.reloadRecommendation();
                       e.stopPropagation();
                    });

                    console.log("Setting up");
                    $("#goButton").click(function(e) {
                        console.log("Sending to: " + wodId);
                        homeView.sendToWodPage(wodId);
                    });


                });

                // Bind to pagebeforecreate on wods and equipment
                $(document).on("pagebeforeshow", "#wodPage", function () {
                    var wodView = new WodView();
                    wodView.renderListHtml();
                });

                $(document).on("pagebeforeshow", "#equipmentPage", function () {
                    var equipmentView = new EquipmentView();
                    equipmentView.renderListHtml();
                });


                $(document).on("pagebeforeshow", "#woddetailPage", function () {
                    var wodView = new WodView();
                    wodView.renderDetailHtml();
                });

                var timer = null;

                //Setup timer
                $(document).on("pagebeforeshow", "#timerPage", function () {
                    timer = new TimerView();

                    //Bind to click
                    $("#spanPauseResume").click(function() {
                        timer.handlePauseResume();
                    });

                    $("#completeButton").click(function() {
                        timer.handleComplete();
                    });
                });

                //Set timer clean-up
                $(document).on("pagebeforehide", "#timerPage", function () {
                       if(timer != null) {
                           timer.resetTimer();
                       }
                });

                //Setup tabatatimer
                var tabataTimer = null;

                $(document).on("pagebeforeshow", "#tabataTimerPage", function () {
                    tabataTimer = new TabataTimerView();
                    tabataTimer.startTiming();

                    //Bind to click
                    $("#spanPauseResume").click(function() {
                        tabataTimer.handlePauseResume();
                    });

                });

                //Set timer clean-up
                $(document).on("pagebeforehide", "#tabataTimerPage", function () {
                    if(tabataTimer != null) {
                        tabataTimer.resetTimer();
                    }
                });

                //Setup completed render
                $(document).on("pagebeforeshow", "#completedPage", function () {
                    var completedView = new CompletedView();
                    completedView.renderCompletedHtml();
                });

                // Bind to mobile back button - go back or close app depending on active page
                document.addEventListener("backbutton", function () {
                    this.handleBackButton();
                }, true);
            },

            handleBackButton: function () {
                var activePage = $.mobile.activePage;
                var menupanel = $.mobile.activePage.find("#menupanel");

                if (menupanel != undefined && menupanel.css("visibility") != "hidden") {
                    menupanel.panel("close");
                } else if (activePage.attr("id") == "home") {
                    mosync.app.exit();
                } else {
                    $.mobile.back();
                }
            },

            createTestData: function () {
                wodTracker.clearStorage();

                wodTracker.addWodRecord("Fran", new Date(2013, 4, 28, 10, 36, 1, 10).getTime(), 405);
                wodTracker.addWodRecord("Fran", new Date(2012, 2, 4, 10, 20, 1, 9).getTime(), 109);
                wodTracker.addWodRecord("Fran", new Date(2011, 2, 4, 8, 13, 1, 7).getTime(), 203);

                wodTracker.addWodRecord("Karen", new Date().getTime(), 203);
                wodTracker.addWodRecord("Karen", new Date(2012, 5, 5, 5, 5, 5, 5).getTime(), 202);
            }
        }
    };

    return singleton();

});
