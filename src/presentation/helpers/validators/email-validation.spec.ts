/* eslint-disable @typescript-eslint/no-unused-vars */

import { EmailValidation } from "./email-validation"
import { HttpRequest, IEmailValidator, serverError } from '../../controllers/signup/signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'

interface ISut {
    sut: EmailValidation
    emailValidatorStub: IEmailValidator
}

const makeSut = (): ISut => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new EmailValidation(emailValidatorStub, 'email')
    return {
        sut,
        emailValidatorStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password'
    }
})

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    return emailValidatorStub
}

describe('EmailValidation Controller', () => {
    test('Should call emailValidator with correct parameters', () => {
        const { sut, emailValidatorStub } = makeSut()
        const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = makeFakeRequest()
        sut.validate(httpRequest.body)
        expect(emailValidatorSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
    test('Should throw if emailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error() // implementação mockada direto, logo...
        })
        expect(sut.validate).toThrow() // possibilita o teste diretamente
    })
})