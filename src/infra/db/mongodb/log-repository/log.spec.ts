import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { LogErrorRepository } from "./log"

describe('LogError Repository', () => {
    let ErrorCollection : Collection
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    beforeEach(async () => {
        ErrorCollection = await MongoHelper.getCollection('errors')
        ErrorCollection.deleteMany({})
    })
    test('Should create an error log on success', async () => {
        const sut =  new LogErrorRepository()
        await sut.logError('any_error')
        const foundError = await ErrorCollection.countDocuments()
        expect(foundError).toBeTruthy()
    })
})