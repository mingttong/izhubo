const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => console.log('mongoose connected!'));
mongoose.connection.on('error', err => console.log(err));

const db = mongoose.connect('mongodb://127.0.0.1:8034/izhubo');

module.exports = {
    mongoose,
    db
}
