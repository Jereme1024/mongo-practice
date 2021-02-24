const usersModel = require('./usersModel')
const postsModel = require('./postsModel')
const commentsModel = require('./commentsModel')

describe('integrated user test', () => {
    it('should create a user with a post', async () => {
        const user = await usersModel.create({ name: 'alice' })
        const post = await postsModel.create({ title: 'Hello world' })

        user.posts.push(post)
        await user.save()

        const alice = await usersModel.findOne({ name: 'alice' })
        expect(alice.posts).toHaveLength(1)
        console.log(alice)
        const alicePost = await postsModel.findOne({ _id: alice.posts[0]._id })
        expect(alicePost.title).toEqual('Hello world')
    })

    it('should create a user with a post and a comment', async () => {
        const user = await usersModel.create({ name: 'alice' })
        const post = await postsModel.create({ title: 'Hello world' })
        const comment = await commentsModel.create({ content: 'Mongo is awesome', reviewer: user._id })

        post.comments.push(comment)
        user.posts.push(post)
        await Promise.all([user.save(), post.save()])

        const alice = await usersModel.findOne({ name: 'alice' })
        expect(alice.posts).toHaveLength(1)
        console.log(alice)
    })

    it('should query a user with populating query', async () => {
        const user = await usersModel.create({ name: 'alice' })
        const post = await postsModel.create({ title: 'Hello world' })
        const comment = await commentsModel.create({ content: 'Mongo is awesome', reviewer: user._id })

        post.comments.push(comment)
        user.posts.push(post)
        await Promise.all([user.save(), post.save()])

        let alice = await usersModel.findOne({ name: 'alice' }).populate('posts')
        expect(alice.posts).toHaveLength(1)
        expect(alice.posts[0].title).toEqual('Hello world')
        console.log('[one level]', alice)

        // two levels
        alice = await usersModel.findOne({ name: 'alice' }).populate({ path: 'posts', populate: 'comments' })
        console.log('[two levels]', JSON.stringify(alice, null, 2))

        // three levels
        alice = await usersModel.findOne({ name: 'alice' }).populate({ path: 'posts', populate: { path: 'comments', populate: 'reviewer' } })
        console.log('[three levels]', JSON.stringify(alice, null, 2))
    })

    it('should remove automatically remove users post when a post is being removed', async () => {
        const user = await usersModel.create({ name: 'alice' })
        const post1 = await postsModel.create({ title: 'Hello' })
        const post2 = await postsModel.create({ title: 'World' })
        user.posts.push(post1, post2)
        await user.save()

        let alice = null
        alice = await usersModel.findOne({ name: 'alice' }).populate('posts')
        expect(alice.posts).toHaveLength(2)
        console.log('[before remove]', alice)

        await postsModel.remove({ _id: post1._id })
        alice = await usersModel.findOne({ name: 'alice' }).populate('posts')
        console.log('[after remove]', alice)
    })

    it('should NOT remove posts when a user is being removed', async () => {
        const post1 = await postsModel.create({ title: 'Hello' })
        const post2 = await postsModel.create({ title: 'World' })
        const user = await usersModel.create({ name: 'alice', posts: [post1, post2] })
        await commentsModel.create({ content: 'test', reviewer: user })

        user.posts.push(post1, post2)
        await user.save()

        await usersModel.deleteOne({ name: 'alice' })

        expect(await postsModel.countDocuments()).toBe(2)
        expect(await commentsModel.countDocuments()).toBe(1)
    })
})
