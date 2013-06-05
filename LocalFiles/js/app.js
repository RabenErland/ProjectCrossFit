
require.config({
    baseUrl: "js/app"
});


// Includes File Dependencies
require( [ "AppMain" ], function(AppMain) {
    AppMain.initialize();
});
