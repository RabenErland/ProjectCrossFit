define("TimerView", ["WodTracker", "WodLookup", "WodView"], function(wodTracker, wodLookupGetter, WodView) {

    var TimerView = function () {

        //Get the WOD being timed
        this.wodAndId = wodLookupGetter.getWodFromQueryParamId();

        //Set initial variables
        this.completeButton = $("#completeButton");
        this.spanPauseResume = $("#spanPauseResume");

        //And reset
        this.resetTimer();
    };

    TimerView.prototype.renderInitialHtml = function() {
        //Set header
        $("#timerHeader").text(this.wodAndId.wod.getName().toUpperCase() + " in progress");

        //Set single line description
        var wodView = new WodView();
        var wodHtml = wodView.getExerciseHtmlOnly(this.wodAndId.wod);

        $("#divTimerExercises").html(wodHtml);
    }

    TimerView.prototype.resetTimer = function() {
        if(this.setIntervalId != null) {
            clearInterval(this.setIntervalId);
        }

        this.lastTimerDate = null;
        this.setIntervalId = null;
        this.totalElapsedTime = 0;
        this.isPaused = true;

        this.completeButton.addClass("ui-disabled");
    };

    TimerView.prototype.startTiming = function() {
        var that = this;

        //Set initial time (if it has not been set)
        if(that.lastTimerDate == null) {
            that.lastTimerDate = new Date();
            that.completeButton.removeClass("ui-disabled");
        }

        //Start timer
        that.setIntervalId = setInterval(function() {
            function padTime(num) {
                return ( num < 10 ? "0" : "" ) + num;
            }

            var dateNow = new Date();
            that.totalElapsedTime += dateNow.getTime() - that.lastTimerDate.getTime();

            var totalElapsedSeconds = Math.floor(that.totalElapsedTime / 1000);

            that.lastTimerDate = dateNow;

            var minuteString = padTime(Math.floor(totalElapsedSeconds / 60));
            var secondString = padTime(Math.floor(totalElapsedSeconds % 60));

            $('#divMinutes').html(minuteString + '<span>min</span>');
            $('#divSeconds').html(secondString + '<span>sec</span>');
        }, 500);
    };

    TimerView.prototype.pauseTiming = function () {
        //Pause timer
        clearInterval(this.setIntervalId);
        this.lastTimerDate = null;
    };

    TimerView.prototype.handlePauseResume = function () {

        if (this.isPaused) {
            this.startTiming();
            this.isPaused = false;
        }
        else {
            this.pauseTiming();
            this.isPaused = true;
        }

        this.spanPauseResume.toggleClass('play-icon').toggleClass('pause-icon');
    };

    TimerView.prototype.handleComplete = function () {

        var date = new Date();
        var time = Math.floor(this.totalElapsedTime / 1000);

        wodTracker.addWodRecord(this.wodAndId.wod.getName(), date, time);

        this.resetTimer();

        $.mobile.changePage("completed.html?id=" + this.wodAndId.id);

    };

    return TimerView;

});








