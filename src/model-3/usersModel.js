const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema({
    name: String,
    posts: [{ type: ObjectId, ref: 'posts' }],
})

schema.pre('deleteOne', { document: true }, async function() {
    const postsModel = mongoose.model('posts')
    const commentsModel = mongoose.model('comments')

    await Promise.all([
        postsModel.remove({ _id: { $in: this.posts } }),
        commentsModel.remove({ reviewer: this._id }),
    ])
})

module.exports = mongoose.model('users', schema)
