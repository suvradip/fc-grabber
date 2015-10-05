// to run this code use phantomjs fiddle-grabber.js
var page;
var fcLink = "http://www.fusioncharts.com/charts/column2d_6/";

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

        var chartData = page.evaluate(function() {

            var chartData = {};    
            var data =  FusionCharts.items["sampleChart"];   
            chartData.type = data.chartType();
            chartData.width = "800";
            chartData.height = "600";
            chartData.dataFormat = "json"; 
            chartData.datasource =  data.getChartData("json");  

            return  chartData;
        });

        console.log(chartData);
        var fs = require('fs');
        var detailsContent  = JSON.stringify(chartData, null, 4);
        fs.write("testData/chartdata.txt", detailsContent, 'w');
        console.log("****** File write done ******");

        phantom.exit();
    } //end of if
});
