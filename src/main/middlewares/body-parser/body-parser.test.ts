import request from 'supertest'
import app from '../../config/app'
import { Request, Response } from 'express'

describe('BodyParser', () => {
    test('Should parser body as json', async () => {

        app.post('/test_body_parser', (req: Request, res: Response) => {
            return res.send(req.body)
        })
        await request(app)
            .post('/test_body_parser')
            .send({name: 'any_name'})
            .expect({name: 'any_name'})
    })
})