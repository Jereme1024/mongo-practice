const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const schema = new Schema({
    title: String,
    author: { type: ObjectId, ref: 'users' },
})

module.exports = mongoose.model('posts', schema)
