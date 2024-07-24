/* eslint-disable @typescript-eslint/no-unused-vars */
import AccountModel from "../../../domain/models/account"
import { AddAccountRepository } from "../../protocols/db/iadd-account-repository"
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
        async compare(password: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    const encrypterStub = new EncrypterStub()
    return encrypterStub
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel>{
            return new Promise(resolve => {
                resolve(makeFakeAccount())
            })
        }
    }
    const addAccountRepositoryStub = new AddAccountRepositoryStub()
    return addAccountRepositoryStub
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
    test('Should call encrypter with correct values', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(makeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
    test('Should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
            reject(new Error())
        }))
        const promise = sut.add(makeAccountData())
        await expect(promise).rejects.toThrow()
    })
    test('Should call addAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'encrypted_password'
        })
    })
    test('Should throw if addAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
            reject(new Error())
        }))
        const promise = sut.add(makeAccountData())
        await expect(promise).rejects.toThrow()
    })
    test('Should return an account on ok', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })
})