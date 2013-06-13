
require.config({
    baseUrl: "js/app",
    urlArgs: "bust=" + (new Date()).getTime() //cache busting
});


// Includes File Dependencies
require( [ "AppMain" ], function(AppMain) {
    AppMain.initialize();
});
