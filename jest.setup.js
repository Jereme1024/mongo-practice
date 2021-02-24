const database = require('./test/inmemdb')

beforeAll(async () => await database.connect())
afterEach(async () => await database.clearDatabase())
afterAll(async () => await database.closeDatabase())
