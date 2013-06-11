define("TabataTimerView", ["WodLookup"], function(wodLookupGetter) {

    var TabataTimer = function () {

        var res = wodLookupGetter.getWodFromQueryParamId();
        this.wod = res.wod;

        this.exerciseSeconds = 20;
        this.restSeconds = 5;
        this.noRounds = 8;
        this.setIntervalId = null;

        this.divCurrentText = $("#divCurrentText");
        this.divNextUpText = $("#divNextUpText");
        this.divSeconds = $("#divSeconds");
        this.beepAudio = $('audio')[0];

        this.resetTimer();
    };

    TabataTimer.prototype.resetTimer = function () {
        this.secondsPassed = 0;
        this.currentRound = 1;
        this.isResting = false;
        this.currentSeconds = this.exerciseSeconds;
        this.currentText = this.wod.exerciseNames[0];
        this.nextText = "Rest";

        if (this.setIntervalId != null) {
            clearInterval(this.setIntervalId);
            this.setIntervalId = null;
        }

        this.renderTexts();
        this.renderTime();
    };

    TabataTimer.prototype.renderTexts = function () {
        this.divCurrentText.html("<strong>" + this.currentText + "</strong>");
        this.divNextUpText.html("<i>Next up: " + this.nextText + "</i>");
    };

    TabataTimer.prototype.renderTime = function () {
        var secondsText = this.currentSeconds < 10 ? "0" + this.currentSeconds : this.currentSeconds;
        this.divSeconds.html(secondsText + "<span>sec</span>");
    };

    TabataTimer.prototype.startTiming = function() {
        var that = this;

        setInterval(function() {
            that.secondsPassed++;
            that.currentSeconds--;

            if(that.currentSeconds == 0) {

                if(that.isResting) {
                    //Shift from rest to exercise
                    that.isResting = false;
                    that.currentRound++; //TODO: Update html

                    if(that.currentRound > that.noRounds) {
                        //TODO: Handle end of Tabata
                    }

                    that.currentText = that.wod.exerciseNames[that.currentRound-1];
                    that.nextText = "Rest";
                    that.currentSeconds = that.exerciseSeconds;
                }
                else {
                    //Shift from exercise to rest
                    that.isResting = true;

                    that.currentText = "Rest";
                    that.nextText = that.wod.exerciseNames[that.currentRound];
                    that.currentSeconds = that.restSeconds;
                }

                //Update current and next text
                that.renderTexts();
            }

            //Play sound on last three seconds
            if(that.currentSeconds <= 3) {
                //Play beep
                that.beepAudio.play();
            }

            //Update second counter
            that.renderTime();

        },1000);

    };

    return TabataTimer;
});
