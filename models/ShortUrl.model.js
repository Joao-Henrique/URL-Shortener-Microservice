//DEFINING STRUCTURE OF SHORT URL PRESENTATION
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//MONGO DB SCHEMA
const urlSchema = new Schema({
  originalUrl: String,
  shorterUrl: String
}, {timestamps: true});

module.exports = mongoose.model('shortUrl', urlSchema);