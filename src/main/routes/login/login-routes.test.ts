import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper"
import app from "../../config/app"
import request from 'supertest'

describe('LoginIn', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    test('Should return an token on success', async () => {
        await request(app)
            .post('/api/login')
            .send({
                email: 'valid_mail@mail.com',
                password: 'valid_password'
            })
            .expect(200)
    })
})