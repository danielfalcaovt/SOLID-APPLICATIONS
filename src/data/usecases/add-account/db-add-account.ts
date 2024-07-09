/* eslint-disable @typescript-eslint/no-unused-vars */
import AccountModel from "../../../domain/models/account";
import { AddAccountModel, AddAccountRepository, IEncrypter } from './db-add-account-protocols'

export default class DbAddAccount implements AddAccountRepository {
    private Encrypter : IEncrypter
    private addAccountRepositoryStub: AddAccountRepository

    constructor(encrypter: IEncrypter, AddAccountRepository: AddAccountRepository) {
        this.Encrypter = encrypter
        this.addAccountRepositoryStub = AddAccountRepository
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const { email, name, password } = account
        const encryptedPassword = await this.Encrypter.encrypt(password)
        const addedAccount = await this.addAccountRepositoryStub.add(Object.assign({}, account, { password: encryptedPassword }))

        return new Promise(resolve => {
            resolve(addedAccount)
        })
    }
}