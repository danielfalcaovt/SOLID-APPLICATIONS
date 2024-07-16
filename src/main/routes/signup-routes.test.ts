import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import app from "../config/app"
import request from 'supertest'

describe('SignUp', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'valid_name',
                email: 'valid_mail@mail.com',
                password: 'valid_password',
                confirmPassword: 'valid_password'
            })
            .expect(200)
    })
})