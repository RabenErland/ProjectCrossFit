define("Wod", ["ExerciseLookup"], function(exerciseLookupGetter) {

    function Wod(wodJson) {
        this.wodJson = wodJson;

        this.shortFormatLines = [];
        this.longFormatLines = [];
        this.exerciseNames = [];

        this.parseExerciseText();

        this.parseRequiredEquipment();

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

    Wod.prototype.getName = function () {
        return this.wodJson.Name;
    };

    Wod.prototype.isTabata = function () {
        return this.wodJson.Type == "Tabata";
    };

    Wod.prototype.parseRequiredEquipment = function () {
        //TODO
        var equipmentSet = {};
        var exerciseNameLookup = exerciseLookupGetter.getNameLookup();

        for(var i=0; i<this.exerciseNames.length; i++) {
            var exerciseName = this.exerciseNames[i].toLowerCase();

            //Get required equipment of each exercise
            var exercise = exerciseNameLookup[exerciseName];
            if(exercise != null && exercise != undefined) {
                var equipmentNames = exercise.getRequiredEquipmentNames();

                //Add to set
                for(var j=0; j<equipmentNames.length; j++) {
                    var equipmentName = equipmentNames[j];
                    equipmentSet[equipmentName] = true;
                }
            }
            else {
                var errorText = "Invalid exercise name (" + exerciseName + ") in WOD (" + this.getName() + ")";
             //   throw errorText;
                  console.log(errorText);
            }
        }

        //extract distinct names from "set" object
        this.requiredEquipmentNames = Object.keys(equipmentSet);
    };

    return Wod;
});



