/* eslint-disable @typescript-eslint/no-unused-vars */

import EmailValidatorAdapter from "./email-validator-adapter"
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

const makeSut = (): EmailValidatorAdapter => {
    const sut = new EmailValidatorAdapter()
    return sut
}

describe('EmailValidator Adapter', () => {
    test('Should return false as isValid', () => {
        const sut = makeSut()
        jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_mail@mail.com')
        expect(isValid).toBe(false)
    })
    test('Should return true as isValid', () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid_mail@mail.com')
        expect(isValid).toBe(true)
    })
    test('Should call isValid with correct value', () => {
        const sut = makeSut()
        const isValidSpy = jest.spyOn(sut, 'isValid')
        sut.isValid('valid_mail@mail.com')
        expect(isValidSpy).toHaveBeenCalledWith('valid_mail@mail.com')
    })
})