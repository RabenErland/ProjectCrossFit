define("ExerciseLookup", ["Exercise", "HtmlUtility"], function(Exercise, htmlUtility) {

    var exerciseList;
    $.ajax({
        dataType : "json",
        url : "data/exercises.json",
        async : false,
        cache : false
    }).done(function(result) {
            exerciseList = result.exercises;
        });

    var exerciseLookup = [];
    var exerciseNameLookup = {};
    $.each(exerciseList, function(i, exerciseItem) {
        var exercise = new Exercise(exerciseItem);
        exerciseLookup[parseInt(exerciseItem.Id)] = exercise;
        exerciseNameLookup[exercise.getName().toLowerCase()] = exercise;
    })


    return {
        getLookup: function()  {
            return exerciseLookup },

        getNameLookup: function() {
            return exerciseNameLookup;
        },

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
