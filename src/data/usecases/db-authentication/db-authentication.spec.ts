/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountModel from "../../../domain/models/account"
import { IHashComparer } from "../../protocols/criptography/ihashcomparer"
import { ILoadAccountByEmail } from "../../protocols/db/load-account-by-email"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
    sut: DbAuthentication
    updateAccessTokenStub: any
    loadAccountStub: ILoadAccountByEmail
    tokenGeneratorStub: any
    hashComparerStub: IHashComparer
}

const makeSut = (): SutTypes => {
    const updateAccessTokenStub = makeUpdateAccessTokenStub()
    const loadAccountStub = makeLoadAccountByEmail()
    const tokenGeneratorStub = makeTokenGeneratorStub()
    const hashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(updateAccessTokenStub, loadAccountStub, tokenGeneratorStub, hashComparerStub)
    return {
        sut,
        updateAccessTokenStub,
        loadAccountStub,
        hashComparerStub,
        tokenGeneratorStub
    }
}

const makeUpdateAccessTokenStub = (): any => {
    class updateAccessTokenStub {
        update(token: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    const _ = new updateAccessTokenStub()
    return _
}

const makeLoadAccountByEmail = (): ILoadAccountByEmail => {
    class loadAccountByEmailStub implements ILoadAccountByEmail {
        load(email: string): Promise<AccountModel | null> {
            return new Promise(resolve => resolve({
                email: 'any_mail',
                id: 'any_id',
                name: 'any_name',
                password: 'any_hash'

            })
        )}
    }
    const _ = new loadAccountByEmailStub()
    return _
}

const makeHashComparer = (): IHashComparer => {
    class hashComparerStub implements IHashComparer {
        compare(password: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    const _ = new hashComparerStub()
    return _
}

const makeTokenGeneratorStub = (): any => {
    class tokenGeneratorStub {
        generate(id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    const _ = new tokenGeneratorStub()
    return _
}

const makeFakeAccount = () => {
    return {
        email: 'any_mail',
        password: 'any_password'
    }
}

describe('DbAuthentication Usecase', () => {
    it('Should call LoadAccountByEmail with correct values', async () => {
        const { sut, loadAccountStub } = makeSut()
        const loadAccountSpy = jest.spyOn(loadAccountStub, 'load')
        await sut.auth(makeFakeAccount())
        expect(loadAccountSpy).toHaveBeenCalledWith('any_mail')
    })
    it('Should return null if invalid credentials', async () => {
        const { sut, loadAccountStub } = makeSut()
        jest.spyOn(loadAccountStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const response = await sut.auth(makeFakeAccount())
        expect(response).toBeFalsy()
    })
    it('Should throw if loadAccount throws', async () => {
        const { sut, loadAccountStub } = makeSut()
        jest.spyOn(loadAccountStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => {
            reject(new Error())
        }))
        const promise = sut.auth(makeFakeAccount()) // captura a promise que o sut retorna
        await expect(promise).rejects.toThrow() // espera que a promise rejeite com um error
    })
    it('Should call HashComparer with correct password', async () => {
        const { sut, hashComparerStub } = makeSut()
        const hashSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeAccount())
        expect(hashSpy).toHaveBeenCalledWith('any_password', 'any_hash')
    })
    it('Should return null if HashComparer fails', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const response = await sut.auth(makeFakeAccount())
        expect(response).toBeFalsy()
    })
    it('Should call TokenGenerator with correct id', async () => {
        const { sut, tokenGeneratorStub } = makeSut()
        const tokenSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        await sut.auth(makeFakeAccount())
        expect(tokenSpy).toHaveBeenCalledWith('any_id')
    })
})