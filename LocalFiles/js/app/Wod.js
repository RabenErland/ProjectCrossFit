define("Wod", [], function() {

    function Wod(wodJson) {
        this.wodJson = wodJson;

        this.shortFormatLines = [];
        this.longFormatLines = [];
        this.exerciseLines = [];

        this.parseExerciseText();
    }

    Wod.getLookupStorageKey = function (wodId) {
        return "projectCrossFit_Wod" + wodId;
    };

    Wod.prototype.getLookupStorageKey = function () {
        return Wod.getLookupStorageKey(this.wodJson.Id);
    };

    Wod.prototype.parseExerciseText = function () {

        var exercises = this.wodJson.Exercises;

        var bracketRegex = /(\[.+?\])|(:|\.|,)/g;  //locate all square brackets and colons

        var longFormatText = "", shortFormatText = ""; //The formatted html for the exercises
        var lastNum = 0; //The last index in the json text that was handled

        var texts = [];

        var m;
        while (m = bracketRegex.exec(exercises)) {
            //add text prior to match (or in between matches)
            var priorText = exercises.substring(lastNum, m.index);
            shortFormatText += priorText;
            longFormatText += priorText;
            var matchText = m[0];

            if (matchText == ":" || matchText == '.' || matchText == ",") {
                //Add line break on : or . for short format and , for long format

                this.longFormatLines.push(longFormatText);

                if(matchText != ",") {
                    this.shortFormatLines.push(shortFormatText);
                    shortFormatText = "";
                }

                longFormatText = ""; //Reset exerciseText
            }
            else {
                //get exercise text without brackets and add tags to highlight exercise names
                var currentExercise = matchText.substring(1, matchText.length - 1);
                var formatted = '<strong>' + currentExercise + '</strong>';

                this.exerciseLines.push(formatted);
                longFormatText += formatted;
                shortFormatText += formatted;
            }
            lastNum = m.index + matchText.length;
        }

        //Add final line
        this.longFormatLines.push(longFormatText);
        this.shortFormatLines.push(shortFormatText);

        return texts;
    };

    Wod.prototype.getName = function () {
        return this.wodJson.Name;
    };

    return Wod;
});



