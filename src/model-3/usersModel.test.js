const usersModel = require('./usersModel')
const postsModel = require('./postsModel')
const commentsModel = require('./commentsModel')


describe('integrated user test', () => {
    it('should remove posts when a user is being removed', async () => {
        const post1 = await postsModel.create({ title: 'New Model S is available!' })
        const post2 = await postsModel.create({ title: 'Model X can really fly' })
        const user = await usersModel.create({ name: 'Elon Musk', posts: [post1, post2] })
        await commentsModel.create({ content: 'test', reviewer: user })

        user.posts.push(post1, post2)
        await user.save()

        expect(await postsModel.countDocuments()).toBe(2)
        expect(await commentsModel.countDocuments()).toBe(1)

        const doc = await usersModel.findOne({ name: 'Elon Musk' })
        await doc.deleteOne()

        expect(await postsModel.countDocuments()).toBe(0)
        expect(await commentsModel.countDocuments()).toBe(0)
    })
})
