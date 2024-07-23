/* eslint-disable @typescript-eslint/no-unused-vars */

import { EmailValidation } from "./email-validation"
import { HttpRequest, IEmailValidator } from '../../controllers/signup/signup-protocols'
import { InvalidParamError } from '../../errors'

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
    test('Should return an error if emailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'any_mail@mail.com' })
        expect(error).toEqual(new InvalidParamError('email'))
    })
    test('Should call emailValidator with correct parameters', () => {
        const { sut, emailValidatorStub } = makeSut()
        const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate({ email: 'any_mail@mail.com' })
        expect(emailValidatorSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
    test('Should throw if emailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error() // substitui a implementação do emailValidator por um retorno de erro forçado
        })
        expect(sut.validate).toThrow() // o controlador receberá o erro e tratará
    })
})