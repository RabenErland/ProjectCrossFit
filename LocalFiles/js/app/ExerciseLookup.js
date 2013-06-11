define("ExerciseLookup", ["Exercise", "HtmlUtility"], function(Exercise, htmlUtility) {

    var exerciseList;
    $.ajax({
        dataType : "json",
        url : "data/exercises.json",
        async : false
    }).done(function(result) {
            exerciseList = result.exercises;
        });

    var exerciseLookup = []
    $.each(exerciseList, function(i, exerciseItem) {
        exerciseLookup[parseInt(exerciseItem.Id)] = new Exercise(exerciseItem);
    })


    return {
        getLookup: function()  {
            return exerciseLookup },

        getExerciseFromQueryParamId:  function() {
            var id = htmlUtility.getIdFromQueryParam();

            if (id != undefined) {
                var exercise = exerciseLookup[id];
                return {exercise: exercise, id: id};
            }

            return null;
        }

    }
});
