const usersModel = require('./usersModel')
const postsModel = require('./postsModel')
const commentsModel = require('./commentsModel')


describe('integrated user test', () => {
    it('should remove posts when a user is being removed', async () => {
        const post1 = await postsModel.create({ title: 'Hello' })
        const post2 = await postsModel.create({ title: 'World' })
        const user = await usersModel.create({ name: 'alice', posts: [post1, post2] })
        await commentsModel.create({ content: 'test', reviewer: user })

        user.posts.push(post1, post2)
        await user.save()

        const doc = await usersModel.findOne({ name: 'alice' })
        await doc.deleteOne()

        expect(await postsModel.countDocuments()).toBe(0)
        expect(await commentsModel.countDocuments()).toBe(0)
    })
})
