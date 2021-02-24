const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema({
    title: String,
    content: String,
    comments: [{ type: ObjectId, ref: 'comments' }],
})

module.exports = mongoose.model('posts', schema)
