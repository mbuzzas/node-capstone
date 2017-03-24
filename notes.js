/*
1 - var fs =  require('fs');
		require('config/database.js');
		connect to the database
		var Food = require('app/models/food') model
		require('Nutrients') model
2 - var foodItems = fs.openFile('fooddata.json'); - use a relative path
3 - loop over the contents of the file, which should be an array of json objects
for(var i=0; i<foodItems.length; i++){
	Food.find({'name':foodItems[i].name},function(err,data){
		if(!err){
			if(data.length==0){
				var nuterients = [];
				for(var j=0; j<foodItems[i].nutrients.length; j++){
					Nutrient.find({'name':foodItems[i].nutrients[j].nutrient},function(err2,data2){
						if(!err2){
							if(data2.length==0){
								var n = new Nutrient({
									map info here
								});
								n.save();
								nutrients.push(n._id);
							} else {
								var n = data2[0];
								nutrients.push(n._id);
							}
						}
					});
				}
				Food.create({
					name: foodItems[i].name,
					nutrients: nutrients,
					servingSize: foodItems[i].measure
				})
			}
		}
	})
}


*/