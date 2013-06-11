define("Exercise", [], function() {

    function Exercise(exerciseJson) {
        this.exerciseJson = exerciseJson;

        this.shortFormatLines = [];
        this.longFormatLines = [];
        this.exerciseNames = [];

        this.parseExerciseText();

        this.requiredEquipmentNames = [];

        this.parseRequiredEquipment();
    }

    Exercise.getLookupStorageKey = function (exerciseId) {
        return "projectCrossFit_Exercise" + exerciseId;
    };

    Exercise.prototype.getLookupStorageKey = function () {
        return Exercise.getLookupStorageKey(this.exerciseJson.Id);
    };

    Exercise.prototype.parseExerciseText = function () {

        var exercises = this.exerciseJson.Exercises;

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

                shortFormatText +=  matchText;

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

                this.exerciseNames.push(currentExercise);
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

    Exercise.prototype.getName = function () {
        return this.exerciseJson.Name;
    };

    Exercise.prototype.parseRequiredEquipment = function() {
        //TODO
        //For each exercise - get list of required equipment names from ExerciseLookup
        //combine to distinct list


    }

    return Exercise;
});



