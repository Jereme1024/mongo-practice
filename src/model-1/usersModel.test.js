const usersModel = require('./usersModel')

describe('usersModel', () => {
    it('should create a user with a post', async () => {
        await usersModel.create({ name: 'Elon Musk', posts: [{ title: 'Model S is released!' }] })

        const musk = await usersModel.findOne({ name: 'Elon Musk' })
        expect(musk.name).toEqual('Elon Musk')
        expect(musk.posts).toHaveLength(1)
        expect(musk.posts[0].title).toEqual('Model S is released!')
        console.log(musk)
    })

    it('should add a new post to a user', async () => {
        await usersModel.create({ name: 'Elon Musk', posts: [{ title: 'Model S is released!' }] })

        await usersModel.updateOne({ name: 'Elon Musk' }, { $push: { posts: { title: 'Model X can really fly' } } })

        const musk = await usersModel.findOne({ name: 'Elon Musk' })
        expect(musk.name).toEqual('Elon Musk')
        expect(musk.posts).toHaveLength(2)
        expect(musk.posts[0].title).toEqual('Model S is released!')
        expect(musk.posts[1].title).toEqual('Model X can really fly')
        console.log(musk)
    })

    it('should remove a post from a user', async () => {
        await usersModel.create({ name: 'Elon Musk', posts: [{ title: 'Model S is released!' }] })

        await usersModel.updateOne({ name: 'Elon Musk' }, { $pull: { posts: { title: 'Model S is released!' } } })

        const musk = await usersModel.findOne({ name: 'Elon Musk' })
        expect(musk.name).toEqual('Elon Musk')
        expect(musk.posts).toHaveLength(0)
        console.log(musk)
    })
})
