/* eslint-disable @typescript-eslint/no-unused-vars */
import AccountModel from "../../../domain/models/account"
import { AddAccountRepository } from "../../protocols/iadd-account-repository"
import DbAddAccount from "./db-add-account"
import { AddAccountModel, IAddAccount, IEncrypter } from './db-add-account-protocols'

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: IEncrypter
    addAccountRepositoryStub: IAddAccount
}

const makeSut = (): SutTypes => {
    const addAccountRepositoryStub = makeAddAccountRepository()
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub implements IEncrypter {
        async encrypt(password: string): Promise<string> {
            return new Promise(resolve => {
                resolve('encrypted_password')
            })
        }
    }
    const encrypterStub = new EncrypterStub()
    return encrypterStub
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel>{
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_mail@mail.com',
                password: 'hashed_password'
            }
            return new Promise(resolve => {
                resolve(fakeAccount)
            })
        }
    }
    const addAccountRepositoryStub = new AddAccountRepositoryStub()
    return addAccountRepositoryStub
}

describe('DbAddAccount Usecase', () => {
    test('Should call encrypter with correct values', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
    test('Should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
            reject(new Error())
        }))
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
    test('Should call addAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'encrypted_password'
        })
    })
})