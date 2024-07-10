import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"


describe('Account Mongo Repository', () => {
    const makeSut = (): AccountMongoRepository => {
        const sut = new AccountMongoRepository()
        return sut
    }
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    beforeEach(async () => {
        const accountColletion = await MongoHelper.getCollection('accounts')
        await accountColletion.deleteMany({})
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    test("Should return an account on success", async () => {
        const sut = makeSut()
        const account = await sut.add({
            name: 'any_name',
            email: 'any_mail',
            password: 'any_password'
        })
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_mail')
        expect(account.password).toBe('any_password')
    })
})