/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import AccountModel from "../../../domain/models/account"
import { SignUpController } from "./signup"
import { AddAccountModel, badRequest, HttpRequest, IAddAccount, IEmailValidator, ok, serverError, IValidation } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'

interface ISut {
    sut: SignUpController
    addAccountStub: IAddAccount
    validationStub: IValidation
}

const makeSut = (): ISut => {
    const emailValidatorStub = makeEmailValidator()
    const validationStub = makeValidationStub()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(addAccountStub, validationStub)
    return {
        sut,
        addAccountStub,
        validationStub
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
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    const addAccountStub = new AddAccountStub()
    return addAccountStub
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

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password'
    }
})

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail',
    password: 'valid_password',
})

describe('SignUp Controller', () => {
    test('Should call AddAccount with correct email', async () => {
        const { sut, addAccountStub } = makeSut()
        const AddSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeFakeRequest())
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
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.body).toEqual(new ServerError(''))
    })
    test('Should return 200 on ok', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })
    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validationSpy = jest.spyOn(validationStub, 'validate')
        const httpResponse = makeFakeRequest()
        await sut.handle(httpResponse)
        expect(validationSpy).toHaveBeenCalledWith(httpResponse.body)
    })
    test('Should return 400 if Validation return error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
    })
})