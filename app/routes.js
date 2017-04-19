var Food = require('./models/food');
var Nutrient = require('./models/nutrients');
var Meal = require('./models/meal');
var moment = require('moment');


module.exports = function(app, passport) {
// app.use(bodyParser.urlencoded({ extended : false }));
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
		// res.sendFile(__dirname+'/addmeal2.html')
		// res.render('addmeal', {"foods": "food"})
		Food.find(function(err, food) {
			if(err) {

			}
		console.log(food)
		res.render('addmeal', {foods: food})
		})
	})

	app.post('/addmeal', (req, res) => {
	})

	app.get('/meal', (req, res) => {
            var meals;
            var foodArray = [];
            var nutrientArray = [];
            var nutrients;
            var obj = {};
            console.log(moment().format("MMM Do YY"));
            Meal.find({"date": {"$gte": moment.utc().hours(0).minutes(0).seconds(0).format(), "$lte": moment.utc().hours(0).minutes(0).seconds(0).add(1, 'day').format()}}).exec()
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
                        // console.log(obj);
                        return Food.find({ '_id': { $in: foodArray } }).exec()
                        .then(foods => {
                        	foods.forEach(function(foodItem) {
                            	nutrientArray = nutrientArray.concat(foodItem.nutrients)
                        	});
                        	obj.nutrientArray = nutrientArray;
                        	return nutrientArray;
                        })

                        // return Food.find({ '_id': { $in: foodArray } }).exec();
                    })
                    .then(function(nutrientArray) {
                        return Nutrient.find({ '_id': { $in: nutrientArray } }).exec()
                        .then(nutrientData => {
                        	obj.nutrientData = nutrientData;
                        	// console.log(obj);
                        	// res.status(201).json(obj);
                        	res.render('meal.ejs', { meals: obj.meals, foods: obj.foodArray, nutrients: obj.nutrientData })
                        })
                    })
                    .catch(err => res.status(500).json({message: err}));
            // })
            //res.render('addmeal.ejs', { meals: meals, foods: foods, nutrients: nutrients })
	});

	app.post('/meal', (req, res) => {
		const requiredFields = ['foodId', 'meals'];
		for (let i=0; i<requiredFields.length; i++) {
			const field = requiredFields[i];
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`
				console.error(message);
				return res.status(400).send(message);
			}
		}
		let dt = req.body.date || moment.utc().format()
		Meal
			.create({
				foodId: req.body.foodId,
				meals: req.body.meals,
				date: dt
			})
			.then(
				post => res.status(201).json(post))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	})

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
		res.render('profile.ejs', {user: req.user});
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






