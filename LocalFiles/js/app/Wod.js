 /* WOD class */
function Wod(wodJson) {
    this.wodJson = wodJson;
}

Wod.getLookupStorageKey = function (wodId) {
    return "projectCrossFit_Wod" + wodId;
};

Wod.prototype.getLookupStorageKey = function () {
    return Wod.getLookupStorageKey(this.wodJson.Id);
};

Wod.createExerciseTexts = function (exercises, isList) {
    var bracketRegex = /(\[.+?\])|(:|\.|,)/g;  //locate all square brackets and colons

    var exerciseText = ""; //The formatted html for the exercises
    var lastNum = 0; //The last index in the json text that was handled

    var texts = [];

    var m;
    while (m = bracketRegex.exec(exercises)) {
        //add text prior to match (or in between matches)
        exerciseText += exercises.substring(lastNum, m.index);
        var matchText = m[0];

        if (matchText == ":" || matchText == '.' || (matchText == "," && !isList)) {
            //Add paragraph on : or . (and , on non-lists)

            //End existing
            texts.push(exerciseText);

            exerciseText = ""; //Reset exerciseText
        }
        else {
            //get exercise text without brackets and add tags to highlight exercise names
            exerciseText += '<strong>' + matchText.substring(1, matchText.length - 1) + '</strong>';
        }
        lastNum = m.index + matchText.length;
    }

    //End last paragraph
    texts.push(exerciseText);

    return texts;
};



Wod.prototype.createHistoryHtml = function () {
    var tracker = ObjectFactory.getWodTracker();
    var wodName = this.getName();

    var records = tracker.getWodRecordsPerName(wodName);

    var html = "";

    for (var i = 0; i < records.length; i++) {
        var record = records[i];

        var date = new Date(record.dateCompleted);
        var dateHtml = DateFormatter.formatDateAsHtml(date);
        var timeHtml = DateFormatter.formatSecondsAsTime(record.time);

        var isBest = tracker.isPersonalBest(record);

        html +=
            '<tr>' +
                '<td class="first-column">' + (isBest ? '<span class="badge-icon"></span>' : '') + '</td>' +
                '<td>' + dateHtml + '</td>' +
                '<td>' + timeHtml + '</td>' +
                '<tr>';

    }
    return html;

};

Wod.prototype.createSingleHtml = function () {

    var exerciseTexts = Wod.createExerciseTexts(this.wodJson.Exercises, false);
    if (exerciseTexts.length == 0)
        return "";

    var remainingExerciseText = Wod.getRemainingExerciseHtml(exerciseTexts);

    var html =
        '<div class="div-single-wod-first-line">' +
            '<p><span class="timer-icon"></span>' + exerciseTexts[0] + '</p>' +
            '</div>' +
            '<div class="div-single-wod-exercises">' +
            remainingExerciseText +
            '</div>'

    return html;
};

Wod.prototype.getRemainingExerciseHtml = function() {
    var exerciseTexts = Wod.createExerciseTexts(this.wodJson.Exercises, true);
    if(exerciseTexts.length == 0)
        return "";

    return Wod.getRemainingExerciseHtml(exerciseTexts);
}

Wod.getRemainingExerciseHtml = function (exerciseTexts) {
    var remainingExerciseHtml = "";

    //Insert paragraphs around each exercise but the first line
    for (var i = 1; i < exerciseTexts.length; i++) {
        var text = exerciseTexts[i];
        remainingExerciseHtml += '<p>' + text + '</p>'
    }

    return remainingExerciseHtml;
};

Wod.prototype.createListHtml = function () {

    var exerciseTexts = Wod.createExerciseTexts(this.wodJson.Exercises, true);
    if(exerciseTexts.length == 0)
        return "";

    var remainingExerciseText = Wod.getRemainingExerciseHtml(exerciseTexts);

    //Create html for list element with one-line exercise text
    var html =  '<li>' +
        '<a href="woddetail.html?id=' + this.wodJson.Id + '"">' +
        '<h2>' + this.wodJson.Name + '</h2>' +
        '<p><i>' + exerciseTexts[0] + '</i></p>' +
        remainingExerciseText +
        '</a></li>';

    return html;

};

Wod.prototype.getName = function () {
    return this.wodJson.Name;
};
/* End of - WOD class */

