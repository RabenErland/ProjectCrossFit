define("ExerciseView", ["ExerciseLookup"],
    function(exerciseLookupGetter) {

        var ExerciseView = function () {
        };

        ExerciseView.prototype = {

            //Function for injecting Exercise List  html from loaded Exercises
            renderListHtml: function () {

                var exerciseLookup = exerciseLookupGetter.getLookup();

                // Determine if html element exists for injection
                if ($("#exerciseList").length > 0) {

                    var html = "";
                    // Iterate through list and create html
                    for (var i in exerciseLookup) {
                        var exercise = exerciseLookup[i];
                        html += this.getSingleItemListHtml(exercise);
                    }

                    $("#exerciseList").html(html);
                }

                //Refresh JQM Listview (to apply JQM styling)
                $('#exerciseList').listview('refresh');
            },

            renderDetailHtml: function () {

                var exerciseLookup = exerciseLookupGetter.getLookup();
                var res = exerciseLookupGetter.getExerciseFromQueryParamId();

                if (res != null) {
                    var exercise = res.exercise;

                    //Set href on button
                    //$("#buttonStartWod").attr("href", "timer.html?id=" + res.id);

                    //Insert exercise html
                    var html = this.getDetailHtml(exercise);
                    $(html).prependTo("#divExercises");

                    //Insert header text
                    $('#exerciseDetailHeader').text(exercise.getName().toUpperCase());

                    $('#exerciseSingleList').listview('refresh');
                }

            },

            getDetailHtml: function (exercise, insertName) {

                var remainingExerciseText = this.combineLines(exercise.longFormatLines, 1, true);

                name = "";
                if(insertName) {
                    name = '<h2>' + exercise.getName() + '</h2>';
                }

                return name +
                    '<div class="div-single-exercise-first-line">' +
                    '<p><span class="timer-icon"></span>' + exercise.longFormatLines[0] + '</p>' +
                    '</div>' +
                    '<div class="div-single-exercise-exercises">' +
                    remainingExerciseText +
                    '</div>';
            },


            combineLines: function (lines, startIndex, addParagraphs) {
                var html = "";

                //Insert paragraphs around each exercise but the first line
                for (var i = startIndex; i < lines.length; i++) {
                    var text = lines[i];
                    if(addParagraphs) {
                        html += '<p>' + text + '</p>'
                    }
                    else {
                        html += text;
                    }
                }

                return html;
            },

            getSingleItemListHtml: function (exercise) {

                var remainingExerciseText = this.combineLines(exercise.shortFormatLines, 1, true);

                //Create html for list element with one-line exercise text
                var html = '<li>' +
                    '<a href="exercisedetail.html?id=' + exercise.exerciseJson.Id + '"">' +
                    '<h2>' + exercise.exerciseJson.Name + '</h2>' +
                    '<p><i>' + exercise.shortFormatLines[0] + '</i></p>' +
                    remainingExerciseText +
                    '</a></li>';

                return html;

            },

            getExerciseHtmlOnly: function(exercise) {
                var remainingExerciseText = this.combineLines(exercise.shortFormatLines, 1, false);
                return '<i>' + exercise.shortFormatLines[0] + '</i>' + remainingExerciseText;
            }
        };

        return ExerciseView; //return constructor
    });
