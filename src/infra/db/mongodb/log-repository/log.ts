import { ILog } from "../../../../data/protocols/db/ILog";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogErrorRepository implements ILog {
    async logError(stack: string): Promise<void> {
        const errorCollection = await MongoHelper.getCollection('errors')
        await errorCollection.insertOne({stack, date: new Date()})
        return new Promise(resolve => resolve())
    }
}