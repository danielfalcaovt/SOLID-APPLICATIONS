import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper"
import env from './config/env'

MongoHelper.connect(env.MongoUrl).then(async () => {
    const app = (await import("./config/app")).default
    app.listen(env.Port, () => console.log(`App is running in ${env.Port} port.`))
})
.catch(console.error)