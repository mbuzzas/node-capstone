const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('../config/database.js');
const {Food} = require('./models/food.js');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

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
	const requiredFields = ['name', 'meal', 'nutrients'];
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
			meal: req.body.meal,
			nutrients: req.body.nutrients})
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
	const fieldsToUpdate = ['name', 'meal', 'nutrients'];
	fieldsToUpdate.foreach(field => {
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


app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
