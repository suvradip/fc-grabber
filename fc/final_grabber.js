// to run this code use phantomjs fiddle-grabber.js
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
                    temp.url = $(this).attr("href");
                    resources.push(temp);
                }
            });

            
            return {

                resources: resources,    
            };
        });
     

       //  var jsonobj = JSON.parse(value.resources);
           var jsonobj = value.resources;
        //console.log(value.resources);

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


var redFilecContent = (function(){

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


 
var createLocalFiles = (function() {
    console.log("****** Start creating local file ******");
    var fs = require('fs');
    if (page.injectJs("jquery.js")) {

        var value = page.evaluate(function(test) {
           
            var resources = [], subresources = [];  
            var temp = {}, temp2 = {} , f1=false, f2=false ;
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
       // phantom.exit();
        redFilecContent();
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
 