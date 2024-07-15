import app from "../config/app"
import request from 'supertest'

describe('SignUp', () => {
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