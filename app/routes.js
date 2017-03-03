module.exports = function(app, passport) {

	//Home page with login link
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	//Login page with login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	//Signup page with signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	//Profile page (protected page)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {user: req.user});
	});

	//Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}