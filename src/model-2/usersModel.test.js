const usersModel = require('./usersModel')
const postsModel = require('./postsModel')
const commentsModel = require('./commentsModel')

describe('integrated user test', () => {
    it('should create a user with a post', async () => {
        const user = await usersModel.create({ name: 'Elon Musk' })
        const post = await postsModel.create({ title: 'Model S is released!' })

        user.posts.push(post)
        await user.save()

        const musk = await usersModel.findOne({ name: 'Elon Musk' })
        expect(musk.name).toEqual('Elon Musk')
        expect(musk.posts).toHaveLength(1)
        console.log(musk)
    })

    it('should create a user with a post and a comment', async () => {
        const user = await usersModel.create({ name: 'Elon Musk' })
        const post = await postsModel.create({ title: 'Model S is released!' })
        const comment1 = await commentsModel.create({ content: 'The fast car ever!', reviewer: user })
        const comment2 = await commentsModel.create({ content: 'Awesome!!!!', reviewer: user })

        post.comments.push(comment1, comment2)
        await post.save()
        user.posts.push(post)
        await user.save()

        const musk = await usersModel.findOne({ name: 'Elon Musk' })
        expect(musk.name).toEqual('Elon Musk')
        expect(musk.posts).toHaveLength(1)
        console.log(musk)
        const muskPost = await postsModel.findOne({ title: 'Model S is released!' })
        expect(muskPost.comments).toHaveLength(2)
    })

    it('should query a user with populating query', async () => {
        const user = await usersModel.create({ name: 'Elon Musk' })
        const post = await postsModel.create({ title: 'Model S is released!' })
        const comment = await commentsModel.create({ content: 'The fast car ever!', reviewer: user })

        post.comments.push(comment)
        await post.save()
        user.posts.push(post)
        await user.save()

        let musk = await usersModel.findOne({ name: 'Elon Musk' }).populate('posts')
        expect(musk.name).toEqual('Elon Musk')
        expect(musk.posts).toHaveLength(1)
        expect(musk.posts[0].title).toEqual('Model S is released!')
        console.log(JSON.stringify(musk, null, 2))

        musk = await usersModel.findOne({ name: 'Elon Musk' }).populate({ path: 'posts', populate: { path: 'comments' } })
        console.log(JSON.stringify(musk, null, 2))

        musk = await usersModel.findOne({ name: 'Elon Musk' }).populate({ path: 'posts', populate: { path: 'comments', populate: { path: 'reviewer' } } })
        console.log(JSON.stringify(musk, null, 2))
    })

    it('should remove automatically remove users post when a post is being removed', async () => {
        const user = await usersModel.create({ name: 'Elon Musk' })
        const post1 = await postsModel.create({ title: 'New Model S is released!' })
        const post2 = await postsModel.create({ title: 'Model Y is coming 666!' })

        user.posts.push(post1, post2)
        await user.save()

        let musk = await usersModel.findOne({ name: 'Elon Musk' }).populate('posts')
        expect(musk.posts).toHaveLength(2)

        await postsModel.deleteOne({ title: 'New Model S is released!' })
        musk = await usersModel.findOne({ name: 'Elon Musk' }).populate('posts')
        expect(musk.posts).toHaveLength(1)
        console.log(musk)
    })

    it('should NOT remove posts when a user is being removed', async () => {
        const user = await usersModel.create({ name: 'Elon Musk' })
        const post1 = await postsModel.create({ title: 'New Model S is released!' })
        const post2 = await postsModel.create({ title: 'Model Y is coming 666!' })

        user.posts.push(post1, post2)
        await user.save()

        await usersModel.deleteOne({ name: 'Elon Musk' })
        const posts = await postsModel.find({})
        expect(posts).toHaveLength(2)
    })
})
