/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSignUpValidation } from "./signup-validation"
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from "../../../presentation/helpers/validators"
import { IValidation } from "../../../presentation/protocols/validation"
import { IEmailValidator } from "../../../presentation/protocols/email-validator"

jest.mock("../../../presentation/helpers/validators/validation-composite")

describe('SignUpValidation Factory', () => {
    it('Should call ValidationComposite with correct values', () => {
        makeSignUpValidation()
        class EmailValidatorStub implements IEmailValidator {
            isValid(email: string): boolean {
                return true
            }
        }
        const emailValidatorStub = new EmailValidatorStub()
        const validations: IValidation[] = []
        for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
            validations.push(new RequiredFieldValidation(pos))
        }
        validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
        validations.push(new EmailValidation(emailValidatorStub, 'email'))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})