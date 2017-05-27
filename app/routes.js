var Food = require('./models/food');
var Nutrient = require('./models/nutrients');
var Meal = require('./models/meal');
var moment = require('moment'); 

module.exports = function(app, passport) {
	//Home page with login link
	app.get('/', function(req, res) {
		console.log("Test");
		res.render('index.ejs');
	});

	app.get('/food', (req, res) => {
		Food
			.find()
			.exec()
			.then(food => {
				res.json(food.map(post => post));
			})
			.catch(
				err => {
					console.error(err);
					res.status(500).json({message: 'Internal server error'});
				});
	});

	app.get('/food/:id', (req, res) => {
		Food
			.findById(req.params.id)
			.exec()
			.then(post => res.json(post))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.post('/food', (req, res) => {
		const requiredFields = ['name', 'nutrients', 'servingSize'];
		for (let i=0; i<requiredFields.length; i++) {
			const field = requiredFields[i];
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`
				console.error(message);
				return res.status(400).send(message);
			}
		}
		Food
			.create({
				name: req.body.name,
				nutrients: req.body.nutrients,
				servingSize: req.body.servingSize})
			.then(
				post => res.status(201).json(post))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.put('/food/:id', (req, res) => {
		if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
			const message = (
				`Request path id (${req.params.id}) and request body id ` +
	      		`(${req.body.id}) must match`);
			console.error(message);
			res.status(400).json({message: message});
		}
		const toUpdate = {};
		const fieldsToUpdate = ['name', 'nutrients', 'servingSize'];
		fieldsToUpdate.forEach(field => {
			if (field in req.body) {
				toUpdate[field] = req.body[field];
			}
		});

		Food
			.findByIdAndUpdate(req.params.id, {$set: toUpdate})
			.exec()
			.then(post => res.status(201).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

	app.delete('/food/:id', (req, res) => {
		Food
			.findByIdAndRemove(req.params.id)
			.exec()
			.then(post => res.status(204).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});


	app.get('/nutrient', (req, res) => {
		Nutrient
			.find()
			.exec()
			.then(nutrient => {
				res.json(nutrient.map(post => post));
			})
			.catch(
				err => {
					console.error(err);
					res.status(500).json({message: 'Internal server error'});
				});
	});

	app.get('/nutrient/:id', (req, res) => {
		Nutrient
			.findById(req.params.id)
			.exec()
			.then(post => res.json(post))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.post('/nutrient', (req, res) => {
		const requiredFields = ['name', 'benefits', 'nutrient_id'];
		for (let i=0; i<requiredFields.length; i++) {
			const field = requiredFields[i];
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`
				console.error(message);
				return res.status(400).send(message);
			}
		}
		Nutrient
			.create({
				name: req.body.name,
				benefits: req.body.benefits,
				nutrient_id: req.body.nutrient_id})
			.then(
				post => res.status(201).json(post))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.put('/nutrient/:id', (req, res) => {
		if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
			const message = (
				`Request path id (${req.params.id}) and request body id ` +
	      		`(${req.body.id}) must match`);
			console.error(message);
			res.status(400).json({message: message});
		}
		const toUpdate = {};
		const fieldsToUpdate = ['name', 'benefits'];
		fieldsToUpdate.forEach(field => {
			if (field in req.body) {
				toUpdate[field] = req.body[field];
			}
		});

		Nutrient
			.findByIdAndUpdate(req.params.id, {$set: toUpdate})
			.exec()
			.then(post => res.status(201).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

	app.delete('/nutrient/:id', (req, res) => {
		Nutrient
			.findByIdAndRemove(req.params.id)
			.exec()
			.then(post => res.status(204).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});
	

	//Add meal
	app.get('/addmeal', (req, res) => {
		var today = moment().format('YYYY-MM-DD'); 
		Food.find(function(err, food) {
			if(err) {

			}
		console.log(food)
		res.render('addmeal', {foods: food, today: today, user: req.user})
		})
	})

	app.post('/addmeal', (req, res) => {
	});

	app.get('/mealtest', (req,res) => {
		res.send({
			"$gte": moment().hours(0).minutes(0).seconds(0).format(), 
			"$lte": moment().hours(0).minutes(0).seconds(0).add(1, 'day').format()
		});
	});

	app.get('/allmeals',(req,res) => {
		Meal.find({},(e,data)=>{
			res.send(data);
		});
	});

	app.get('/meal', (req, res) => {
			var date = moment(date).format('MMM Do YY');
            var meals;
            var foodArray = [];
            var foodObj = {};
            var nutrientArray = [];
            var nutrients;
            var nutObj = {};
            var obj = {};
            Meal.find({"date": {"$gte": moment().hours(0).minutes(0).seconds(0).format(), "$lte": moment().hours(0).minutes(0).seconds(0).add(1, 'day').format()}}).exec()
                    .then(function(meals) {
                        meals.forEach(function(meal) {
                        	meal.foodId.forEach((ele) => {
                        		if(ele) {
                        			foodArray.push(ele)
                        		}
                        	})
                        });
                        console.log(foodArray)
                        obj.meals = meals;
                        obj.foodArray = foodArray;
                        return Food.find({ '_id': { $in: foodArray } }).exec()
                        .then(foods => {
                        	foods.forEach(function(foodItem) {
                        		foodObj[foodItem._id] = {name:foodItem.name,nutrients:foodItem.nutrients};
                            	nutrientArray = nutrientArray.concat(foodItem.nutrients)
                        	});
                        	// res.send(foodObj);
                        	obj.nutrientArray = nutrientArray;
                        	return nutrientArray;
                        })
                    })
                    .then(function(nutrientArray) {
                        return Nutrient.find({ '_id': { $in: nutrientArray } }).exec()
                        .then(nutrientData => {
                        	obj.nutrientData = nutrientData;
                        	nutrientData.forEach(function(nut){
                        		nutObj[nut._id] = {
                        			name: nut.name,
                        			benefits: nut.benefits
                        		};
                        	});
                        	res.render('meal.ejs', { meals: obj.meals, foods: foodObj, nutrients: nutObj, date: date})
                        })
                    })
                    .catch(err => res.status(500).json({message: err}));
	});

	app.post('/meal', (req, res) => {
		const requiredFields = ['foodIDs', 'meals'];
		for (let i=0; i<requiredFields.length; i++) {
			const field = requiredFields[i];
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`
				console.error(message);
				return res.status(400).send(message);
			}
		}

		let dt = moment(req.body.date).format() || moment().format()
		Meal
			.create({
				foodId: req.body.foodIDs.split(","),
				meals: req.body.meals,
				date: dt,
				userId: req.body.userId
			})
			.then(
				post => res.redirect('/meal'))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.get('/meal/:id', (req, res) => {
		var date = moment(date).format('MMM Do YY');
        var meals;
        var foodArray = [];
        var foodObj = {};
        var nutrientArray = [];
        var nutrients;
        var nutObj = {};
        var obj = {};
        Meal
        	.findOne({_id:req.params.id})
        	.exec()
            .then(function(meal) {
                
            	meal.foodId.forEach((ele) => {
            		if(ele) {
            			foodArray.push(ele)
            		}
            	});
                
                console.log(foodArray)
                obj.meals = meal;
                obj.foodArray = foodArray;
                return Food.find({ '_id': { $in: foodArray } }).exec()
                .then(foods => {
                	foods.forEach(function(foodItem) {
                		foodObj[foodItem._id] = {name:foodItem.name,nutrients:foodItem.nutrients};
                    	nutrientArray = nutrientArray.concat(foodItem.nutrients)
                	});
                	// res.send(foodObj);
                	obj.nutrientArray = nutrientArray;
                	return nutrientArray;
                })
            })
            .then(function(nutrientArray) {
                return Nutrient.find({ '_id': { $in: nutrientArray } }).exec()
                .then(nutrientData => {
                	obj.nutrientData = nutrientData;
                	nutrientData.forEach(function(nut){
                		nutObj[nut._id] = {
                			name: nut.name,
                			benefits: nut.benefits
                		};
                	});
                	res.render('mealid.ejs', { meals: obj.meals, foods: foodObj, nutrients: nutObj, date: date})
                })
            })
            .catch(err => res.status(500).json({message: err}));
	});

	app.put('/meal/:id', (req, res) => {
		if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
			const message = (
				`Request path id (${req.params.id}) and request body id ` +
	      		`(${req.body.id}) must match`);
			console.error(message);
			res.status(400).json({message: message});
		}
		const toUpdate = {};
		const fieldsToUpdate = ['foodId', 'meals', 'date'];
		fieldsToUpdate.forEach(field => {
			if (field in req.body) {
				toUpdate[field] = req.body[field];
			}
		});
		console.log(toUpdate);
		Meal
			.findByIdAndUpdate(req.params.id, {$set: toUpdate})
			.exec()
			.then(post => res.status(201).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

	app.delete('/meal/:id', (req, res) => {
		Meal
			.findByIdAndRemove(req.params.id)
			.exec()
			.then(post => res.status(204).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});



	//Login page with login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	//Signup page with signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//Profile page (protected page)
	app.get('/profile', isLoggedIn, function(req, res) {
		var date = moment().format('MMM Do YY');
		var datesArray = [];
		Meal.find({userId: req.user._id},function(err, meals) {
			if(err) {

			}
			var dates = {};
			for (var i = 0; i < meals.length; i++) {
				if(!dates.hasOwnProperty(meals[i].date)){
					dates[meals[i].date] = [];
					datesArray.push(meals[i].date);
 				}
 				dates[meals[i].date].push(meals[i]);
			}
			console.log(meals)
			res.render('profile.ejs', {user: req.user, meals:dates, dates:datesArray, date: date});
		});
	});

	//Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.use('*', function(req, res) {
	  res.status(404).json({message: 'Not Found'});
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}






