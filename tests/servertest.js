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

// describe('foods', function() {

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

// 	describe('GET endpoint', function() {

// 	})
// })

describe('Get meals', function() {

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

	describe('Get endpoint', function() {

		it('should return all meals for user', function() {
			let res;
			return chai.request(app)
				.get('/meal')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.meal.should.have.length.of.at.least(1);
					return meal.count();
				})
				.then(function(count) {
					res.body.meal.should.have.length.of(count);
				});
		});

		it('should return meals with correct fields', function() {
			let resMeal;
			return chai.request(app)
				.get('/meal')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.meal.should.be.a('array');
					res.body.meal.should.have.length.of.at.least(1);
					res.body.meal.forEach(function(meal) {
						meal.should.be.a('object');
						meal.should.include.keys(
							'id', 'foodId', 'meals', 'date', 'userId');
					});
					resMeal = res.body.meal[0];
					return Meal.findById(resRestaurant.id);
				})
				.then(function(meal) {
					resMeal.id.should.equal(meal.id);
					resMeal.foodId.should.equal(meal.foodId);
					resMeal.meals.should.equal(meal.meals);
					resMeal.date.should.equal(meal.date);
					resMeal.userId.should.equal(meal.userId);
				});
		});
	});

	describe('POST endpoint', function() {

		it('should add a new meal', function() {
			const newMeal = generateMealData();
			return chai.request(app)
				.post('/meal')
				.send(newMeal)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'foodId', 'meals', 'date', 'userId');
					res.body.id.should.not.be.null;
					res.body.foodId.should.equal(newMeal.foodId);
					res.body.meals.should.equal(newMeal.meals);
					res.body.date.should.equal(newMeal.date);
					res.body.userId.should.equal(newMeal.userId);
					return Meal.findById(res.body.id);
				});
		});
	});

	describe('PUT endpoint', function() {

		it('should update fields'. function() {
			const updateData = {
				meals: 'brunch'
			};

			return Meal 
				.findOne()
				.exec()
				.then(function(meal) {
					updateData.id = meal.id;
					return chai.request(app)
						.put(`/meal/${meal.id}`)
						.send(updateData);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Meal.findById(updateData.id).exec();
				})
				.then(function(meal) {
					meal.meals.should.equal(updateData.meals);
				});
		});
	});

	describe('DELETE endpoint', function() {

		it('should delete meal by id', function() {
			let meal;
			return meal
				.findOne()
				.exec()
				.then(function(_meal) {
					meal = _meal;
					return chai.request(app).delete(`/meal/${meal.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return MEal.findById(meal.id).exec();
				})
				.then(function(_meal) {
					should.not.exist(_meal);
				});
		});
	});
});




























