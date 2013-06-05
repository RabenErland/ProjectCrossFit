define("TimerView", ["WodTracker", "WodLookup"], function(wodTracker, wodLookupGetter) {

    var TimerView = function () {

        //Get the WOD being timed
        this.wodAndId = wodLookupGetter.getWodFromQueryParamId();

        if (this.wodAndId != null) {
            var wod = this.wodAndId.wod;

            //Set header
            $("#timerHeader").text(wod.getName().toUpperCase() + " in progress")
        }

        //Set initial variables
        this.spanPlayPause = $("#spanPauseResume");
        this.reset();
    }

    TimerView.prototype.reset = function() {
        if(this.setIntervalId != null) {
            clearInterval(this.setIntervalId);
        }

        this.lastTimerDate = null;
        this.setIntervalId = null;
        this.totalElapsedTime = 0;
    }

    TimerView.prototype.handlePauseResume = function() {
        var that = this;

        if(that.spanPlayPause.attr('class') == 'play-icon') {
            //Set initial time (if it has not been set)
            if(that.lastTimerDate == null) {
                that.lastTimerDate = new Date();
            }

            //Start timer
            that.setIntervalId = setInterval(function() {
                function padTime(num) {
                    return ( num < 10 ? "0" : "" ) + num;
                }

                var dateNow = new Date();
                var elapsedTime = dateNow.getTime() - that.lastTimerDate.getTime();
                that.totalElapsedTime += elapsedTime;

                var totalElapsedSeconds = Math.floor(that.totalElapsedTime / 1000);

                that.lastTimerDate = dateNow;

                var minuteString = padTime(Math.floor(totalElapsedSeconds / 60));
                var secondString = padTime(Math.floor(totalElapsedSeconds % 60));

                $('#divMinutes').html(minuteString + '<span>min</span>');
                $('#divSeconds').html(secondString + '<span>sec</span>');
            }, 500);
        }
        else {
            //Pause timer
            clearInterval(that.setIntervalId);
            that.lastTimerDate = null;
        }

        that.spanPlayPause.toggleClass('play-icon').toggleClass('pause-icon');
    }

    TimerView.prototype.handleComplete = function() {

        var date = new Date();
        var time = Math.floor(this.totalElapsedTime / 1000);

        wodTracker.addWodRecord(this.wodAndId.wod.getName(), date, time);

        this.reset()

        $.mobile.changePage("completed.html?id=" + this.wodAndId.id);

    }

    return TimerView;

});








