// to run this code use phantomjs fiddle-grabber.js
var page;
var fcLink = "http://www.fusioncharts.com/lib/fcassets/data/gallery/msline_550_300_2.json";

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
        return document.querySelector('body').innerText;
        });
        var fs = require('fs');
        fs.write("chartdata.txt", text, 'w');
        console.log("****** File write done ******");
        phantom.exit();
    } //end of if
});

