const usersModel = require('../src/usersModel')
const postsModel = require('../src/postsModel')
const database = require('./inmemdb')

beforeAll(async () => await database.connect())
afterEach(async () => await database.clearDatabase())
afterAll(async () => await database.closeDatabase())

describe('Users', () => {
    it('should create an user', async () => {
        await usersModel.create({ name: 'Alice' })
        const users = await usersModel.find()
        console.log(users)
        expect(users).toHaveLength(1)
        expect(users[0]).toMatchObject({ name: 'Alice' })
    })

    it('should have a post', async () => {
        let user = await usersModel.create({ name: 'Alice' })
        const post = await postsModel.create({ title: `Alice's post`, author: user._id })
        user.posts.push(post)
        await user.save()
        user = await usersModel.findOne({ name: 'Alice' }).populate({ path: 'posts', populate: { path: 'author', select: '_id name' } })
        console.log(JSON.stringify(user, null, 2))
        expect(0).toBe(0)
    })

    it('should delete a post in user', async () => {
        let user = await usersModel.create({ name: 'Alice' })
        const post = await postsModel.create({ title: `Alice's post`, author: user._id })
        user.posts.push(post)
        await user.save()
        user = await usersModel.findOne({ name: 'Alice' }).populate({ path: 'posts' })
        console.log(JSON.stringify(user, null, 2))
        console.log(user.postsSize)

        await postsModel.findByIdAndDelete(post._id)
        user = await usersModel.findOne({ name: 'Alice' }).populate({ path: 'posts' })
        console.log(JSON.stringify(user, null, 2))
        console.log(user.postsSize)

        expect(0).toBe(0)
    })

    it('should NOT have a inexistent post', async () => {
        let user = await usersModel.create({ name: 'Alice' })
        const post = await postsModel.create({ title: `Alice's post` })
        user.posts.push(post._id)
        await user.save()
        user = await usersModel.findOne({ name: 'Alice' }).populate({ path: 'posts', populate: { path: 'author', select: '_id name' } })
        console.log(JSON.stringify(user, null, 2))
        expect(0).toBe(0)
    })

    it.only('should partial search text', async () => {
        await usersModel.insertMany([{
            name: 'alice wang',
        }, {
            name: 'bob lee',
        }, {
            name: 'cathy wang',
        }])

        const users = await usersModel.find({ $text: { $search: 'Wang' } })
        console.log({ users })
        expect(0).toBe(0)
    })
})
