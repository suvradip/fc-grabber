var fs = require('fs');
   var url = [];
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
                C.location = "chartdata/"+ A.name + "/" + B.name + "/" + C.name + ".json";
                url.push(C);
            }    
        } 

    }

    var detailsContent  = JSON.stringify(url, null, 4);
    fs.write("demo.json" , detailsContent, 'w');
    phantom.exit();