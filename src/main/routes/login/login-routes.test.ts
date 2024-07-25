import { Collection } from "mongodb"
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper"
import app from "../../config/app"
import request from 'supertest'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('LoginIn', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    test('Should return an token on success', async () => {
        const password = await hash('valid_password', 12)
        await accountCollection.insertOne({
            name: 'valid_name',
            email: 'valid_mail@email.com',
            password
        })
        await request(app)
            .post('/api/login')
            .send({
                email: 'valid_mail@email.com',
                password: 'valid_password'
            })
            .expect(200)
    })
})