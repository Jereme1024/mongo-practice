const mongoose = require('mongoose')
const Schema = mongoose.Schema
const postsSchema = require('./postsSchema')

const schema = new Schema({
    name: String,
    posts: [postsSchema],
})

module.exports = mongoose.model('users', schema)
