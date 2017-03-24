var Food = require('./models/food');
var Nutrient = require('./models/nutrients');
var Meal = require('./models/meal');



module.exports = function(app, passport) {

	//Home page with login link
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	app.get('/food', (req, res) => {
		Food
			.find()
			.exec()
			.then(food => {
				res.json(food.map(post => post.apiRepr()));
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
			.then(post => res.json(post.apiRepr()))
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
				post => res.status(201).json(post.apiRepr()))
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
			.findByIdAndRemove(req.param.id)
			.exec()
			.then(post => res.status(204).end())
			.catch(err => res.status(500).json({message: 'Internal server error'}));
	});






	app.get('/nutrient', (req, res) => {
		Nutrient
			.find()
			.exec()
			.then(nutrient => {
				res.json(nutrient.map(post => post.apiRepr()));
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
			.then(post => res.json(post.apiRepr()))
			.catch(err => {
				console.error(err);
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.post('/nutrient', (req, res) => {
		const requiredFields = ['name', 'benefits'];
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
				benefits: req.body.benefits})
			.then(
				post => res.status(201).json(post.apiRepr()))
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

	app.get('/meal', (req, res) => {
            // Meal
            // 	.find()
            // 	.exec()
            // 	.then(meal => {
            // 		res.json(meal.map(post => post.apiRepr()));
            // 	})
            // 	.catch(
            // 		err => {
            // 			console.error(err);
            // 			res.status(500).json({message: 'Internal server error'});
            // 		});
            var meals;
            var foodArray = [];
            var food;
            var nutrientArray = [];
            var nutrients;
            Meal.find({
                        created: { $gte: moment.midnight(), $lte: moment.add(1, 'day').midnight() }.exec()
                    .then(function(mealData) {
                        meals = mealData;
                        return meals;
                    })
                    .then(function(meals) {
                        meals.forEach(function(meal) {
                            meal.food.forEach(function(food) {
                                if (!food.id in foodArray) {
                                    foodArray.push(food.id);
                                }
                            });
                        });
                        return Food.find({ '_id': { $in: foodArray } }).exec();
                    })
                    .then(function(foods) {
                        food = foods;
                        foods.forEach(function(foodItem) {
                            foodItem.nutrient.forEach(function(nutrient) {
                                if (!nutrient.id in nutrientArray) {
                                    nutrientArray.push(nutrient.id);
                                }
                            });
                        });

                        return Nutrient.find({ '_id': { $in: nutrientArray } }).exec();
                    })
                    .then(function(nutrientData) {
                        nutrients = nutrientData;
                    })
            })
	});

    app.get('/meal', (req, res) => {
     	res.render('meal.ejs', { meals: meals, food: food, nutrients: nutrients })
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






