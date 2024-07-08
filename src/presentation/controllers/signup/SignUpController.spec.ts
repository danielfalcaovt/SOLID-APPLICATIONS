/* eslint-disable @typescript-eslint/no-unused-vars */

import AccountModel from "../../../domain/models/account"
import { SignUpController } from "./signup"
import { AddAccountModel, HttpRequest, IAddAccount, IEmailValidator } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'

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
        async add(account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_mail',
                password: 'valid_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    const addAccountStub = new AddAccountStub()
    return addAccountStub
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name was provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email was provided.', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
    
    test('Should return 400 if no password was provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
    test('Should return 400 if no confirmation password was provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
    })
    test('Should return 400 if password confirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                password: 'any_password',
                confirmPassword: 'different_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
    })
    test('Should return 400 if an invalid email was provided', async () => {
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
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should call emailValidator with correct parameters', async () => {
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
        await sut.handle(httpRequest)
        expect(emailValidatorSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
    test('Should return 500 if an invalid email throws', async () => {
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
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should call AddAccount with correct email', async () => {
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
        await sut.handle(httpRequest)
        expect(AddSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_mail@mail.com',
            password: 'any_password'
        })
    })
    test('Should return 500 if addAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => {
                reject(new Error())
            })
        })
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should return 200 on ok', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_mail',
                password: 'valid_password',
                confirmPassword: 'valid_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_mail',
            password: 'valid_password',
        })
    })
})