const usersModel = require('./usersModel')

describe('usersModel', () => {
    it('should create a user with a post', async () => {
        const alice = await usersModel.create({
            name: 'alice',
            posts: [{ title: 'first post' }],
        })

        expect(alice.name).toEqual('alice')
        expect(alice.posts).toHaveLength(1)
        expect(alice.posts[0].title).toEqual('first post')
        console.log(alice)
    })

    it('should add a new post to a user', async () => {
        await usersModel.create({
            name: 'alice',
            posts: [{ title: 'first post' }],
        })

        await usersModel.updateOne({ name: 'alice' }, { $push: { posts: { title: 'second post' } } })

        const alice = await usersModel.findOne({ name: 'alice' })
        expect(alice.posts).toHaveLength(2)
        expect(alice.posts[0].title).toEqual('first post')
        expect(alice.posts[1].title).toEqual('second post')
        console.log(alice)
    })

    it('should remove a post from a user', async () => {
        await usersModel.create({
            name: 'alice',
            posts: [{ title: 'first post' }],
        })

        await usersModel.updateOne({ name: 'alice' }, { $pull: { posts: { title: 'first post' } } })

        const alice = await usersModel.findOne({ name: 'alice' })
        expect(alice.posts).toHaveLength(0)
        console.log(alice)
    })
})
