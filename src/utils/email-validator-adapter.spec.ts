/* eslint-disable @typescript-eslint/no-unused-vars */

import EmailValidatorAdapter from "./email-validator-adapter"
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

describe('EmailValidator Adapter', () => {
    test('Should return false as isValid', () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_mail@mail.com')
        expect(isValid).toBe(false)
    })
    test('Should return true as isValid', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('valid_mail@mail.com')
        expect(isValid).toBe(true)
    })
    test('Should call isValid with correct value', () => {
        const sut = new EmailValidatorAdapter()
        const isValidSpy = jest.spyOn(sut, 'isValid')
        sut.isValid('valid_mail@mail.com')
        expect(isValidSpy).toHaveBeenCalledWith('valid_mail@mail.com')
    })
})