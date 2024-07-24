import { AddAccountRepository } from "../../../../data/protocols/db/iadd-account-repository"
import AccountModel from "../../../../domain/models/account"
import { AddAccountModel } from "../../../../domain/usecases/add-account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
        const collection = await MongoHelper.getCollection('accounts')
        const result = await collection.insertOne(account)
        return MongoHelper.map(account, result.insertedId)
    }
}