const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema({
    content: String,
    reviewer: { type: ObjectId, ref: 'users' },
})

module.exports = mongoose.model('comments', schema)
