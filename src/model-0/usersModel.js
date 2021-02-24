const { MongoInstance } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const schema = new Schema({
    name: String,
    posts: [{ type: ObjectId, ref: 'posts' }],
})

schema.virtual('postsSize').get(function() {
    return this.posts.length
})

schema.pre('deleteOne', function() {
    throw new Error('No')
})

schema.index({ name: 'text' })

module.exports = mongoose.model('users', schema)
