const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {User} = require('./app/models/user.js');
const {Meal} = require('./app/models/meal.js');
const {PORT, DATABASE_URL} = require('./config/database.js');
const {TEST_DATABASE_URL} = require('./config/database.js');
const {closeServer, runServer, app} = require('../server');

// let nutrientID = "";
// let foodID = "";
// let userID = "";
// let mealID = "";

chai.use(chaiHttp);

function seedMealData() {
	console.info('seeding meal data');
	const seedData = [];
	for (let i=1; i<=10; i++) {
		seedData.push(generateMealData());
	}
	return Meal.insertMany(seedData);
}

function generateFoodId() {
	const foodId = ['58cb40bf44cfb80938516311', '58d556a694e1bb0fe63b9f13', '58d5609b94e1bb0fe63b9f14', '58d5612094e1bb0fe63b9f15'];
	return foodId[Math.floor(Math.random() * foodId.length)];
}

function generateMeals() {
	const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
	return meals[Math.floor(Math.random() * meals.length)];
}

function generateMealData() {
	return {
		foodId: generateFoodId(),
		meals: generateMeals(),
		date: faker.date.past(),
		userId: '592856c1e33be1001139869c',
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}



describe('login / logout tests:', function() {

	it('should allow user to signup', function(done) {
		chai.request(app)
		.post('/signup')
		.send({ email: test@gmail.com, password: test})
		.end(function(err, res) {
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.have.property('email');
			res.body._id.should.be.a('string');
			done();
		});
	});

	it('should allow user to login', function(done) {
		chai.request(app)
		.post('/login')
		.send({ email: test@gmail.com, password: test})
		.end(function(err, res) {
			res.should.have.status(200);
			res.should.be.json;
			should.equal(err, null);
			res.body.should.be.a('object');
			res.body.should.have.property('message');
			res.body.message.should.equal('success');
			done();
		});
	});

	it('should allow user to logout', function(done) {
		chai.request(app)
		.get('/logout')
		.end(function(err, res) {
			res.should.have.status(200);
			done();
		});
	});
})

describe('foods', function() {

	before(funtion() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedMealData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	})

	describe('GET endpoint', function() {
		
	})
})

// describe('Get meals', function() {

// 	before(funtion() {
// 		return runServer(TEST_DATABASE_URL);
// 	});

// 	beforeEach(function() {
// 		return seedMealData();
// 	});

// 	afterEach(function() {
// 		return tearDownDb();
// 	});

// 	after(function() {
// 		return closeServer();
// 	})

// 	describe('Get endpoint', function() {

// 		it('should return all meals for user', function() {
// 			let res;
// 			return chai.request(app)
// 				.get('/meal')
// 				.then(function(_res) {
// 					res = _res;
// 					res.should.have.status(200);
// 					res.body.meal.should.have.length.of.at.least(1);
// 					return meal.count();
// 				})
// 				.then(function(count) {
// 					res.body.meal.should.have.length.of(count);
// 				});
// 		});

// 		it('should return meals with correct fields', function() {
// 			let resMeal;
// 			return chai.request(app)
// 				.get('/meal')
// 				.then(function)
// 				//PICK UP FROM HERE**
// 		})
// 	})
// })




























