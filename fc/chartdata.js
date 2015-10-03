// to run this code use phantomjs fiddle-grabber.js
var page, fcResource ={};

fcResource.url = [];
fcResource.counter = -1;
fcResource.Flag = false;
fcResource.hopC = 1;

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

var readContents = (function(fcobj){

    var data;
    if (page.injectJs("jquery.js")) {

        data = page.evaluate(function() {
           // var data = document.querySelector('body').innerText;
           return FusionCharts.items["sampleChart"].getChartData("json"); 
       });
            } //end of IF

            if(data && data !== null)
            {

               console.log("Data Format --- > " + data);
               console.log("saved in : chartdata/" + fcobj.location + ".txt");
               var fs = require('fs');
               var detailsContent  = JSON.stringify(data, null, 4);
               fs.write("chartdata/" + fcobj.location + ".txt", detailsContent, 'w');
               console.log("****** File write done ******");
               console.log("");
               data = {};
               fcResource.hopC =1;
               opensublink();
           }else {
            fcResource.counter -= 1;
            opensublink();

        }    
    });



var opensublink = (function() {
    console.log("Try --> " + fcResource.hopC ++);
    fcResource.counter += 1;
    if (fcResource.counter >= fcResource.url.length) {
        phantom.exit();
    }
    console.log("******  Openning "+ (fcResource.counter + 1) +" link " + fcResource.url[fcResource.counter].url + " *****");
    page.open(fcResource.url[fcResource.counter].url, function(status) {
        if (status == 'success') {
            readContents(fcResource.url[fcResource.counter]);
        } else {
            fcResource.counter -= 1;
            console.log("****** Link cannot be opened may be broken or slow internet connectivity, will retry now ******");

            setTimeout(function() {
                opensublink();
            }, 10000);      
        }

    });    
});


var readFilecContent = (function(){

    var fs = require('fs');
    var fileContent = fs.read("FC-links.json");
    fileContent = JSON.parse(fileContent);
    for(var i=0; i<fileContent.length; i++)
    {
        var A=fileContent[i];

        for(var j=0; j<A.attr.length; j++)
        {
            var B = A.attr[j];
            
            for(var k=0; k<B.subAttr.length; k++)
            {
                var C = B.subAttr[k];
                C.location = A.name + "/" + B.name + "/" + C.name;
                fcResource.url.push(C);
            }    
        } 

    }

    opensublink();
});


readFilecContent();