import request from 'supertest'
import app from '../../config/app'
import { Request, Response } from 'express'

describe('CORS', () => {
    test('Should access-control-allow-origin be *', async () => {

        app.get('/test_cors', (req: Request, res: Response) => {
            return res.send()
        })
        await request(app)
            .get('/test_cors')
            .expect("access-control-allow-origin", '*')
            .expect("access-control-allow-headers", '*')
            .expect("access-control-allow-methods", '*')
    })
})