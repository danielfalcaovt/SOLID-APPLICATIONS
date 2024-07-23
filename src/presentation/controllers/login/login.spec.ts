/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAuthenticator } from "../../../domain/usecases/authentication"
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, HttpRequest, IEmailValidator, ok, serverError, unauthorized } from './login-protocols'
import { LoginController } from "./login"
import { IValidation } from "../signup/signup-protocols"

interface SutTypes {
    sut: LoginController
    validationStub: IValidation
    authenticationStub: IAuthenticator
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const authenticationStub = makeAuthenticationStub()
    const sut = new LoginController(validationStub, authenticationStub)
    return {
        sut,
        validationStub,
        authenticationStub
    }
}

const makeValidationStub = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(data: any): Error | null {
            return null
        }
    }
    const validationStub = new ValidationStub()
    return validationStub
}

const makeAuthenticationStub = (): IAuthenticator => {
    class AuthenticationStub implements IAuthenticator {
        async auth(email:string, password: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    const authenticationStub = new AuthenticationStub()
    return authenticationStub
}

const makeHttpRequest = (): HttpRequest => ({
    body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
    }
})

describe('Login Controller', () => {
    it('Should call Authentication with correct values', async ()=>{
        const { sut, authenticationStub } = makeSut()
        const isValidSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeHttpRequest())
        expect(isValidSpy).toHaveBeenCalledWith( 'any_mail@mail.com', 'any_password')
    })
    it('Should return 401 if invalid credentials was provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(unauthorized())
    })
    it('Should return 500 if Authentication throw', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    it('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(ok('any_token'))
    })
    it('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validationSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeHttpRequest()
        await sut.handle(httpRequest)
        expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})