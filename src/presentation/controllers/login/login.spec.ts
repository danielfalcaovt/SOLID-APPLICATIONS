/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, IEmailValidator } from "../signup/signup-protocols"
import { LoginController } from "./login"

interface SutTypes {
    sut: LoginController
    emailValidator: IEmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidator = makeEmailValidatorStub()
    const sut = new LoginController(emailValidator)
    return {
        sut,
        emailValidator
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
                email: 'any_email@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
    it('Should return 400 if an invalid email was provided', async () => {
        const { sut, emailValidator } = makeSut()
        jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
})