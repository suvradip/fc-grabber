
var fs=require('fs');
var chartdata = {};
var prevFilename = "";



 console.log("starting.."); 

 var setCharAt = (function (str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
});



	var files = JSON.parse(fs.read("demo.json"));

    for(var i=0; i<files.length; i++) //files.length
	{
		

		var file= {};
		
		file.flocation = files[i].location;	
		console.log("Test ---> " +  file.flocation);
		file.fcontent = JSON.parse(fs.read(file.flocation));
		file.fposition  = file.flocation.lastIndexOf("/");
		file.name = file.flocation.slice(0, file.fposition);
		var temparray = file.flocation.split("/");

		temparray = temparray.slice(1, temparray.length);
		file.test_id = "";

		for(var j=0; j<temparray.length; j++)
		{	
		if(file.test_id === "")	
		file.test_id += temparray[j];
		else
		file.test_id += "_"+temparray[j];
		}

		file.test_id = file.test_id.replace(/\.[^/.]+$/, "");

		file.test_id = file.test_id.toLowerCase();
		file.test_id = file.test_id.replace(/ /g,'-');

		
		if(file.fcontent.dataSource.chart.hasOwnProperty("animation"))
		file.fcontent.dataSource.chart.animation = "0";
		else
		file.fcontent.dataSource.chart.animation = "0";	


		if(file.name === prevFilename)
		{
			
			var chart = {};
			chart.description = "";
			chart.options = file.fcontent;
			chart.refimage = "./test/regression-test/chart-gallery/" + file.name.replace('chartdata/','').split(' ').join('-').toLowerCase() + "/ref-images/" + file.test_id + ".png";
			chart.id = file.test_id;
			chartdata[file.test_id]=chart;

		}else
		{
			prevFilename = file.name;
			var chart = {};
		
			chartdata = {};
			chart.description = "";
			chart.options = file.fcontent;
			chart.refimage = "./test/regression-test/chart-gallery/" + file.name.replace('chartdata/','').split(' ').join('-').toLowerCase() + "/ref-images/" + file.test_id + ".png";
			chart.id = file.test_id;
			chartdata[file.test_id]=chart;
		}	

		var detailsContent  = JSON.stringify(chartdata, null, 4).trim();

	    fs.write("test/regression-test/chart-gallery/" + file.name.replace('chartdata/','').split(' ').join('-').toLowerCase() +"/chartsSpec.json", detailsContent, 'w');
	    console.log("****** File write done ******");
	   
	}	

 phantom.exit();













