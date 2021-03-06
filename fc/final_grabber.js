// to run this code use phantomjs final-grabber.js
var page;
var fcLink = "http://www.fusioncharts.com/charts/column-bar-charts/";

var secondaryResources = {};

secondaryResources.url =[];
secondaryResources.counter = -1;
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



var createSublinks = (function(link) {
    console.log("****** Start creating local files ******");
    var fs = require('fs');
    if (page.injectJs("jquery.js")) {

        var value = page.evaluate(function() {
           
            var resources = [];  
            var temp = {}, c=0 ;
            //temp += "[";
            //resources.push(temp);

            //ul.secondary-nav.arrow-list li a
            //div.block4 a
            
            $("div.block3 a").each(function() {

                if($(this).attr("href") !== 'javascript:void(0);')    
                {
                    temp = {};          
                    temp.name = $(this).children("span.heading").text();
                    temp.url = $(this).attr("href");
                    resources.push(temp);
                }
            });

            
            return {

                resources: resources,    
            };
        });
     

        var fileContent = fs.read("FC-links.json");
        fileContent = JSON.parse(fileContent);
        for(var i=0; i<fileContent.length; i++)
        {
            var A=fileContent[i];

            for(var j=0; j<A.attr.length; j++)
            {
                var B = A.attr[j];
               
                if(B.url === link && value.resources.length >0)
                B.subAttr = value.resources;   
            } 

        }


        var detailsContent  = JSON.stringify(fileContent, null, 4);
        fs.write("FC-links.json", detailsContent, 'w');

        console.log("sublinks write done.") ;
    } //end of if

});





var opensublink = (function() {
    secondaryResources.counter += 1;
    if (secondaryResources.counter >= secondaryResources.url.length) {
        phantom.exit();
    }
    console.log("****** " + (secondaryResources.counter + 1) + " Openning link " + secondaryResources.url[secondaryResources.counter].url + " *****");
    page.open(secondaryResources.url[secondaryResources.counter].url, function(status) {
        if (status == 'success') {
            createSublinks(secondaryResources.url[secondaryResources.counter].url);
        } else {
            secondaryResources.counter -= 1;
            console.log("****** Link cannot be opened may be broken or slow internet connectivity, will retry now ******");
        }
    });
});



var opensublinkInterval = (function() {
    console.log("");
    console.log("sublinks");
    
   
    setInterval(function() {
        opensublink();
    }, 20000);
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
            secondaryResources.url.push(B);
        } 
                
    }

    opensublinkInterval();
});


 
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
        readFilecContent();
    } //end of if

});

var startRender = (function() {
 
    console.log("");
    console.log("Initializing the program");
    console.log("");

    page.open(fcLink, function(status) {
        if (status == 'success') {
            createLocalFiles();
        } else {
            fiddleFetch.counter -= 1;
            console.log("****** Link cannot be opened may be broken or slow internet connectivity, will retry now ******");
        }
    });
});



 startRender();
 