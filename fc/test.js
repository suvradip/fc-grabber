// to run this code use phantomjs fiddle-grabber.js
var page;
var fcLink = "http://www.fusioncharts.com/charts/pyramid_3/";

//"http://www.fusioncharts.com/charts/"

page = require('webpage').create();
// ignoring all console log of the site
page.onConsoleMessage = (function(msg) {
    console.log("");
});

// ignoring all javascript error of the site
page.onError = (function(msg) {
    console.log("Javascript error on page");
}); 

// ignoring all javascript alert of the page
page.onAlert = (function(msg) {
  console.log("");
});




console.log('Loading a web page');

page.open(fcLink, function (status) {
  
  if (page.injectJs("jquery.js")) {

        var text = page.evaluate(function() {
        return  FusionCharts.items["sampleChart"].getChartData("json"); 
        });

        var fs = require('fs');
        var detailsContent  = JSON.stringify(text, null, 4);
        fs.write("testdata/chartdata1.txt", detailsContent, 'w');
        console.log("****** File write done ******");

        phantom.exit();
    } //end of if
});
