 
/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Collection, MongoClient, ObjectId } from "mongodb"

export const MongoHelper = {
    db: { connected: false, client: null as unknown as MongoClient },
    uri: null as unknown as string,
    async connect(uri: string | undefined) {
        if (uri) {
            this.uri = uri
            this.db.client = new MongoClient(uri)
            this.db.client.connect()
            this.db.connected=true
        }
    },
    async disconnect() {
        await this.db.client.close()
        this.db.connected=false
    },
    async getCollection(name: string): Promise<Collection> {
        if (!this.db.connected) {
            await this.connect(this.uri)
        }
        return this.db.client.db().collection(name)
    },
    async map(data: any, _id: string | ObjectId): Promise<any> {
        return {
            ...data,
            id: String(_id)
        }
    }
}