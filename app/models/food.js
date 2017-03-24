var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
	name: {type: String, required: true},
	nutrients: {type: [Object], required: false},
	servingSize: {type: String, required: true}
});

foodSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		name: this.name,
		nutrients: this.nutrients,
		servingSize: this.servingSize,
	};
}


module.exports = mongoose.model('Food', foodSchema)


/*

	var meals;
	var foodArray = [];
	var food;
	var nutrientArray = [];
	var nutrients;

	Meal.find({created: {$gte : moment.midnight(), $lte : moment.add(1,'day').midnight()}).exec()
		.then(function(mealData){
			meals = mealData;
			return meals;
		})
		.then(function(meals){
			meals.forEach(function(meal){
				meal.food.forEach(function(food){
					if(!food.id in foodArray){
						foodArray.push(food.id);
					}
				});
			});
			return Food.find({'_id': { $in: foodArray}}).exec();
		})
		.then(function(foods){
			food = foods;
			foods.forEach(function(foodItem){
				foodItem.nutrient.forEach(function(nutrient){
					if(!nutrient.id in nutrientArray){
						nutrientArray.push(nutrient.id);
					}
				});
			});

			return Nutrient.find({'_id': {$in: nutrientArray}}).exec();
		})
		.then(function(nutrientData){
			nutrients = nutrientData;
		});

		res.render('meal.ejs',{meals:meals, food:food, nutrients:nutrients});


	var meal;

	first - get today's meal
	Meal.find({created: {$gte : moment.midnight(), $lte : moment.add(1,'day').midnight(), type: 'dinner'}, function(err,data){
		if(!err){
			meal = data;
			Food.find({_id: { $in: meal.food }}, function(err,foodData){
				if(!err){
					meal.foodItems = foodData;
					nutrients = [];
					for(var i=0; i<foodData.length; i++){
						for(var j=0; j<foodData[i].nutrients.length; j++){
							if(!foodData[i].nutrients[j] in nutrients){
								nutrients.push(foodData[i].nutrients[j]);
							}
						}
					}
					Nutrient.find({id: {$in:nutrients}},function(err,nutData){
						if(!err){
							meal.nutrients = nutData;
							res.render('profile.ejs',{meal:meal});
						}
					});
				}
			});
		}
	})


*/