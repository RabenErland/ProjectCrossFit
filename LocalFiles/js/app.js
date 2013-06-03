// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,
require.config({
    baseUrl: "js",
    paths: {
        "app" : "app",
        "jquery": "lib/jquery-1.9.1",
        "jquerymobile": "lib/jquery.mobile-1.3.1"
    },
    shim: {
    }
});


// Includes File Dependencies
require([ "jquery" ], function( $, Mobile ) {

    require( [ "jquerymobile" ], function() {
        $("#body").show();

        require( [ "app/Setup" ], function(projectcrossfit) {
            projectcrossfit.load();
        });
    });
} )
