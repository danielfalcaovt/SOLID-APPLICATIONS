import app from "../../config/app"
import request from 'supertest'
import { Request, Response } from 'express'

describe('Content Type', () => {
    test('Ensure default content type as json', async () => {
        app.get('/test_content_type', (req: Request, res: Response) => {
            res.send('')
        })
        await request(app)
        .get('/test_content_type')
        .expect('content-type', /json/)
    })
    test('Ensure content type as xml', async () => {
        app.get('/test_content_type_xml', (req: Request, res: Response) => {
            res.type('xml')
            res.send('')
        })
        await request(app)
        .get('/test_content_type_xml')
        .expect('content-type', /xml/)
    })
})