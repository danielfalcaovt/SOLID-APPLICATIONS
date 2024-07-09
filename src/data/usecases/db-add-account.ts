/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AccountModel from "../../domain/models/account";
import { AddAccountModel, IAddAccount } from "../../domain/usecases/add-account";

export default class DbAddAccount implements IAddAccount {
    private Encrypter : any
    constructor(encrypter: any) {
        this.Encrypter = encrypter
    }
    async add(account: AddAccountModel): Promise<AccountModel> {
        const { email, name, password } = account
        const encryptedPassword = await this.Encrypter.encrypt(password)
        return new Promise(resolve => {
            resolve({
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_mail',
                password: encryptedPassword 
            })
        })
    }
}