import EmailValidatorAdapter from "./email-validator-adapter"

describe('EmailValidator Adapter', () => {
    test('Should return false as isValid', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_mail@mail.com')
        expect(isValid).toBe(false)
    })
})