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
           
            var resources = [];  
            var temp = "", f1=false, f2=false ;
            //ul.secondary-nav.arrow-list li a
            //div.block4 a
            $("ul.secondary-nav.arrow-list li a").each(function() {

                if($(this).attr("href") !== 'javascript:void(0);')    
                {

                    temp = "";
                    temp += "          {\n";
                    temp += "           \"name\" : \"" + $(this).text() + "\",\n";
                    temp += "           \"url\" : \"" + $(this).attr("href") + "\"\n";
                 
                       

                    resources.push(temp);
                    temp = "          },";
                    resources.push(temp);
                }
                else {
                    temp = "";
                    if(f1)
                    {   
                        resources.pop();
                        temp = "          }\n";
                        temp += "        ] \n  },";
                    }else
                    {
                      temp +="[\n";  
                    }    
                     f1=true;
                   
                    temp += "\n{\n\"name\" : \"" + $(this).text() + "\", \n";
                    temp += "\"attr\" : [";
                    resources.push(temp);
                }
            });

            temp="";
            resources.pop();
            temp = "          }";
            resources.push(temp);
            temp = "          }\n";
            temp= "\n       ] \n";
            temp += "  } \n ]";
             resources.push(temp);
            return {
               
                resources: resources,
               
            };
        });
     

        var detailsContent  = "";
         

         for (var index in value.resources) {
            detailsContent +=  value.resources[index] + '\n';

        }
       
        fs.write("FC-links.json", detailsContent, 'w');
     
        
        console.log("****** File write done ******");
        phantom.exit();
    } //end of if

});

var startRender = (function() {
 
    console.log("");
    console.log("Initializing the program");
    console.log("Local folder created");
    console.log("");

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