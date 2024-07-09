/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEncrypter } from "../protocols/iencrypter"
import DbAddAccount from "./db-add-account"

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: IEncrypter
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
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

describe('DbAddAccount Usecase', () => {
    test('Should call encrypter with correct values', () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail',
            password: 'valid_password'
        }
        sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})