import { AddAccountRepository } from "../../../../data/protocols/iadd-account-repository"
import AccountModel from "../../../../domain/models/account"
import { AddAccountModel } from "../../../../presentation/controllers/signup/signup-protocols"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
        const collection = await MongoHelper.getCollection('accounts')
        const result = await collection.insertOne(account)
        return new Promise(resolve => resolve({...account, id: String(result.insertedId)}))
    }
}