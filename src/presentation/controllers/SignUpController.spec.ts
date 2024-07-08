/* eslint-disable @typescript-eslint/no-unused-vars */

import AccountModel from "../../domain/models/account"
import { AddAccountModel, IAddAccount } from "../../domain/usecases/add-account"
import { InvalidParamError, MissingParamError, ServerError } from "../errors"
import IEmailValidator from "../protocols/email-validator"
import { HttpRequest } from "../protocols/http-protocols"
import { SignUpController } from "./signup"

interface ISut {
    sut: SignUpController
    emailValidatorStub: IEmailValidator
    addAccountStub: IAddAccount
}

const makeSut = (): ISut => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    return emailValidatorStub
}
const makeAddAccount = (): IAddAccount => {
    class AddAccountStub implements IAddAccount {
        add(account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_mail',
                password: 'valid_password'
            }
            return fakeAccount
        }
    }
    const addAccountStub = new AddAccountStub()
    return addAccountStub
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name was provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email was provided.', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
    
    test('Should return 400 if no password was provided', () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
    test('Should return 400 if no confirmation password was provided', () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
    })
    test('Should return 400 if password confirmation fails', () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                password: 'any_password',
                confirmPassword: 'different_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
    })
    test('Should return 400 if an invalid email was provided', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should call emailValidator with correct parameters', () => {
        const { sut, emailValidatorStub } = makeSut()
        const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(emailValidatorSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
    test('Should return 500 if an invalid email throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should call AddAccount with correct email', () => {
        const { sut, addAccountStub } = makeSut()
        const AddSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(AddSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_mail@mail.com',
            password: 'any_password'
        })
    })
})