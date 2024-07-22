/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAuthenticator } from "../../../domain/usecases/authentication"
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, HttpRequest, IEmailValidator, serverError, unauthorized } from './login-protocols'
import { LoginController } from "./login"

interface SutTypes {
    sut: LoginController
    emailValidator: IEmailValidator
    authenticationStub: IAuthenticator
}

const makeSut = (): SutTypes => {
    const emailValidator = makeEmailValidatorStub()
    const authenticationStub = makeAuthenticationStub()
    const sut = new LoginController(emailValidator, authenticationStub)
    return {
        sut,
        emailValidator,
        authenticationStub
    }
}

const makeEmailValidatorStub = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    return emailValidatorStub
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
    it('Should return 400 if no email was provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
    it('Should return 400 if no password was provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
    it('Should call emailValidator with correct email', async ()=>{
        const { sut, emailValidator } = makeSut()
        const isValidSpy = jest.spyOn(emailValidator, 'isValid')
        await sut.handle(makeHttpRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
    it('Should return 400 if an invalid email was provided', async () => {
        const { sut, emailValidator } = makeSut()
        jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
    it('Should return 500 if emailValidator throws', async () => {
        const { sut, emailValidator } = makeSut()
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
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
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})