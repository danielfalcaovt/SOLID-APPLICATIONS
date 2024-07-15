/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { MongoClient, ObjectId } from "mongodb"

export const MongoHelper = {
    client: null as unknown as MongoClient,
    async connect(uri: string | undefined) {
        if (uri) {
            this.client = new MongoClient(uri)
            this.client.connect()
        }
    },
    async disconnect() {
        await this.client.close()
    },
    async getCollection(name: string) {
        return await this.client.db().collection(name)
    },
    async map(data: any, _id: string | ObjectId): Promise<any> {
        return {
            ...data,
            id: String(_id)
        }
    }
}