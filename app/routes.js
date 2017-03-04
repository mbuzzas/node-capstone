module.exports = function(app, passport) {

	//Home page with login link
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	//Login page with login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	//app.post('/login', passport stuff goes here)

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

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}