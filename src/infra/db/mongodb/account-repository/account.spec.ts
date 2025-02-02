import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

let accountCollection: Collection

describe('Account Mongo Repository', () => {
    const makeSut = (): AccountMongoRepository => {
        const sut = new AccountMongoRepository()
        return sut
    }
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
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
    test('Should throw if add throws', async () => {
        const sut = makeSut()
        jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(async () => Promise.reject(new Error()))
        const promise = sut.add({
            name: 'any_name',
            email: 'any_mail',
            password: 'any_password'
        })
        expect(promise).rejects.toThrow()
    })
    test('Should return an account on loadByEmail success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_mail',
            password: 'any_password'
        })
        const account = await sut.loadByEmail('any_mail')
        expect(account).toBeTruthy()
        expect(account?.id).toBeTruthy()
        expect(account?.name).toBe('any_name')
        expect(account?.email).toBe('any_mail')
        expect(account?.password).toBe('any_password')
    })
    test('Should return null if loadByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail('any_mail')
        expect(account).toBeFalsy()
    })
    test('Should throw if loadByEmail throws', async () => {
        const sut = makeSut()
        jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(async () => Promise.reject(new Error()))
        const promise = sut.loadByEmail('any_mail')
        expect(promise).rejects.toThrow()
    })
    test('Should update accessToken on updateAccessToken', async () => {
        const sut = makeSut()
        const res = await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_mail',
            password: 'any_password'
        })
        await sut.updateAccessToken(res.insertedId, 'any_token')
        const check = await accountCollection.findOne({_id: res.insertedId})
        expect(check?.accessToken).toBe('any_token')
    })
})