/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountModel from "../../../domain/models/account"
import { ILoadAccountByEmail } from "../../protocols/load-account-by-email"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
    sut: DbAuthentication
    updateAccessTokenStub: any
    loadAccountStub: ILoadAccountByEmail
    tokenGeneratorStub: any
    hashComparerStub: any
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
        load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve({
                email: 'any_mail',
                id: 'any_id',
                name: 'any_name',
                password: 'any_password'

            })
        )}
    }
    const _ = new loadAccountByEmailStub()
    return _
}

const makeHashComparer = (): any => {
    class hashComparerStub {
        compare(token: string): Promise<boolean> {
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
describe('DbAuthentication Usecase', () => {
    it('Should call LoadAccountByEmail with correct values', async () => {
        const { sut, loadAccountStub } = makeSut()
        const loadAccountSpy = jest.spyOn(loadAccountStub, 'load')
        await sut.auth({ email: 'any_mail', password: 'any_password' })
        expect(loadAccountSpy).toHaveBeenCalledWith('any_mail')
    })
})