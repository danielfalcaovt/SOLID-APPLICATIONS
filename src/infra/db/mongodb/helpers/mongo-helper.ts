/* eslint-disable @typescript-eslint/no-unused-vars */
import { MongoClient } from "mongodb"

export const MongoHelper = {
    client: null as unknown as MongoClient,
    async connect(uri: string | undefined) {
        if (process.env.MONGO_URL) {
            this.client = await MongoClient.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
        }
    },
    async disconnect() {
        await this.client.close()
    }
}