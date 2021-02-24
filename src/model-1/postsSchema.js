const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    title: String,
})

module.exports = schema
