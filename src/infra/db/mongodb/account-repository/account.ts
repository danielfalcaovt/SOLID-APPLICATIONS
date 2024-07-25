import { AddAccountRepository } from "../../../../data/protocols/db/iadd-account-repository"
import { ILoadAccountByEmail } from "../../../../data/protocols/db/load-account-by-email"
import AccountModel from "../../../../domain/models/account"
import { AddAccountModel } from "../../../../domain/usecases/add-account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository, ILoadAccountByEmail {
    async add(account: AddAccountModel): Promise<AccountModel> {
        const collection = await MongoHelper.getCollection('accounts')
        const result = await collection.insertOne(account)
        return MongoHelper.map(account, result.insertedId)
    }
    async loadByEmail(email: string): Promise<AccountModel | null> {
        const collection = await MongoHelper.getCollection('accounts')
        const account = await collection.findOne({email})
        if (account) {
            console.log(account)
            return MongoHelper.map(account)
        }else {
            return null
        }
    }
}