define("TabataTimerView", ["WodLookup", "WodTracker", "WodView"], function(wodLookupGetter, wodTracker, WodView) {

    var TabataTimer = function () {

        this.wodAndId = wodLookupGetter.getWodFromQueryParamId();
        this.exerciseNames = this.wodAndId.wod.exerciseNames;

        var wodJson = this.wodAndId.wod.wodJson;

        //Read Tabata params from Wod
        this.exerciseSeconds = parseInt(wodJson.Work);
        this.restSeconds = parseInt(wodJson.Rest);
        this.noRounds = parseInt(wodJson.Rounds);
        this.setIntervalId = null;

        //Cache selectors and audio reference
        this.divCurrentText = $("#divTabataCurrentText");
        this.divNextUpText = $("#divTabataNextUpText");
        this.divSeconds = $("#divTabataSeconds");
        this.divTimerRounds = $("#divTabataTimerRounds");
        this.spanPauseResume = $("#spanTabataPauseResume");
        this.beepAudio = $('audio')[0];

        //Reset
        this.resetTimer();
    };

    TabataTimer.prototype.renderInitialHtml = function () {

        this.injectRoundHtml();

        //Set header
        $("#tabataTimerHeader").text(this.wodAndId.wod.getName().toUpperCase() + " in progress");

        //Set single line description
        var wodView = new WodView();
        var wodHtml = wodView.getExerciseHtmlOnly(this.wodAndId.wod);

        $("#divTabataExercises").html(wodHtml);

        this.renderTexts();
        this.renderTime();
    };

    TabataTimer.prototype.injectRoundHtml = function () {
        var html = "Rounds ";
        for (var i = 0; i < this.noRounds; i++) {
            html += "<div>" + (i + 1) + "</div>"
        }

        this.divTimerRounds.html(html);
    };

    TabataTimer.prototype.resetTimer = function () {
        this.secondsPassed = 0;
        this.currentRound = 1;
        this.isResting = false;
        this.currentSeconds = this.exerciseSeconds;
        this.currentText = this.exerciseNames[0];
        this.nextText = "Rest";
        this.isPaused = true;

        if (this.setIntervalId != null) {
            clearInterval(this.setIntervalId);
            this.setIntervalId = null;
        }
    };

    TabataTimer.prototype.renderTexts = function () {
        this.divCurrentText.html(this.currentText);
        this.divNextUpText.html("Next up: " + this.nextText);

        var rounds = this.divTimerRounds.children();
        rounds.slice(0, this.currentRound).addClass("tabata-timer-round-enabled");
    };

    TabataTimer.prototype.renderTime = function () {
        var secondsText = this.currentSeconds < 10 ? "0" + this.currentSeconds : this.currentSeconds;
        this.divSeconds.html(secondsText + "<span>sec</span>");
    };

    TabataTimer.prototype.startTiming = function () {
        var that = this;

        that.setIntervalId = setInterval(function () {
            that.secondsPassed++;
            that.currentSeconds--;

            if (that.currentSeconds == 0) {

                if (that.isResting) {
                    if (that.currentRound == that.noRounds) {
                        that.handleComplete();
                        console.log("Completed: " +that.currentRound);
                        return;
                    }

                    //Shift from rest to exercise
                    that.isResting = false;
                    that.currentRound++;

                    var index = (that.currentRound - 1) % that.exerciseNames.length;
                    that.currentText = that.exerciseNames[index];
                    that.nextText = "Rest";
                    that.currentSeconds = that.exerciseSeconds;
                }
                else {
                    //Shift from exercise to rest
                    that.isResting = true;

                    that.currentText = "Rest";
                    var index = (that.currentRound) % that.exerciseNames.length;
                    that.nextText = that.currentRound == that.noRounds ? "WOD complete" : that.exerciseNames[index];
                    that.currentSeconds = that.restSeconds;
                }

                //Update current and next text
                that.renderTexts();
            }

            //Play sound on last three seconds
            if (that.currentSeconds <= 3) {
                //Play beep
                that.beepAudio.play();
            }

            //Update second counter
            that.renderTime();

        }, 1000);

    };

    TabataTimer.prototype.handleComplete = function () {

        var date = new Date();
        var time = this.secondsPassed;
        wodTracker.addWodRecord(this.wodAndId.wod.getName(), date, time);
        this.resetTimer();

        $.mobile.changePage("completed.html?id=" + this.wodAndId.id);
    };

    TabataTimer.prototype.pauseTiming = function () {
        //Pause timer
        clearInterval(this.setIntervalId);
    };

    TabataTimer.prototype.handlePauseResume = function () {

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

    return TabataTimer;
});
