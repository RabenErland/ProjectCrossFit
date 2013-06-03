
//TODO MOVE CODE BELOW

Timer = function() {
    //Todo change to object variables
    Timer.lastTimerDate = null;
    Timer.setIntervalId = null;
    Timer.totalElapsedTime = 0;
    Timer.spanPlayPause = $("#spanPauseResume");
}

Timer.prototype.handlePauseResume = function() {
    if(Timer.spanPlayPause.attr('class') == 'play-icon') {
        //Set initial time (if it has not been set)
        if(Timer.lastTimerDate == null) {
            Timer.lastTimerDate = new Date();
        }

        //Start timer
        Timer.setIntervalId = setInterval(function() {
            function padTime(num) {
                return ( num < 10 ? "0" : "" ) + num;
            }

            var dateNow = new Date();
            var elapsedTime = dateNow.getTime() - Timer.lastTimerDate.getTime();
            Timer.totalElapsedTime += elapsedTime;

            var totalElapsedSeconds = Math.floor(Timer.totalElapsedTime / 1000);

            Timer.lastTimerDate = dateNow;

            var minuteString = padTime(Math.floor(totalElapsedSeconds / 60));
            var secondString = padTime(Math.floor(totalElapsedSeconds % 60));

            $('#divMinutes').html(minuteString + '<span>min</span>');
            $('#divSeconds').html(secondString + '<span>sec</span>');
        }, 500);
    }
    else {
        //Pause timer
        clearInterval(Timer.setIntervalId);
        Timer.lastTimerDate = null;
    }

    Timer.spanPlayPause.toggleClass('play-icon').toggleClass('pause-icon');
}






