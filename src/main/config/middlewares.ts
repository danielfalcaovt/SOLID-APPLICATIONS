import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser/body-parser'
import { cors } from '../middlewares/cors/cors'
import { contentType } from '../middlewares/content-type/content-type'

export default function middlewares(app: Express): void {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}