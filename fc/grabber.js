// to run this code use phantomjs fiddle-grabber.js
var page;
var fcLink = "http://www.fusioncharts.com/charts/column-bar-charts/";

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
page.onAlert = function(msg) {
  console.log("");
}


 
var createLocalFiles = (function(urlObject) {
    console.log("****** Start creating local files ******");
    var fs = require('fs');
    if (page.injectJs("jquery.js")) {

        var value = page.evaluate(function() {
           
            var resources = [], subresources = [];  
            var temp, temp2, f1=false ;
            $("ul.secondary-nav.arrow-list li a").each(function() {

                if($(this).attr("href") !== 'javascript:void(0);')    
                {
                    temp ={};
                    temp.name = $(this).text();
                    temp.url =  $(this).attr("href");
                    subresources.push(temp);
                }
                else {

                    if(f1)
                    {   
                        if(subresources && subresources.length > 0 )
                        {
                            temp2.attr = subresources;
                            resources.push(temp2);
                            subresources = [];
                        }
                    }

                    f1=true;
                    temp2 = {};
                    temp2.name = $(this).text();
                }
            });

            return resources;
        });
     

        var detailsContent  = JSON.stringify(value, null, 4);
        fs.write("FC-links.json", detailsContent, 'w');
        
        console.log("****** File write done ******");
        phantom.exit();
    } //end of if

});

var startRender = (function() {
 
    console.log("");
    console.log("Initializing the program");


    page.open(fcLink, function(status) {
        if (status == 'success') {
            createLocalFiles(fcLink);
        } else {
            fiddleFetch.counter -= 1;
            console.log("****** Link cannot be opened may be broken or slow internet connectivity, will retry now ******");
        }
    });
});



 startRender();