// config/database.js
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://localhost/node-capstone/';
exports.PORT = process.env.PORT || 8080;