import { Router, Express } from 'express'
import { readdirSync } from 'fs'

export default (app: Express) => {
    const router = Router()
    app.use('/api', router)
    readdirSync(`${__dirname}/../routes/login`).map(async file => { // map every file inside login folder
        if (!file.includes('.test')){  // check if it doesn't have .test in file name
            (await import(`../routes/login/${file}`)).default(router) // import and call it with router
        }
    })
    readdirSync(`${__dirname}/../routes/signup`).map(async file => {
        if (!file.includes('.test')){
            (await import(`../routes/signup/${file}`)).default(router)
        }
    })
}