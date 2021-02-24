const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema({
    name: String,
    posts: [{ type: ObjectId, ref: 'posts' }],
})

module.exports = mongoose.model('users', schema)
