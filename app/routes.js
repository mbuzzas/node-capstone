module.exports = function(app, passport) {

	//Home page with login link
	app.get('/', function(req, res) {
		res.render('index.ejs');
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
};

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



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}






