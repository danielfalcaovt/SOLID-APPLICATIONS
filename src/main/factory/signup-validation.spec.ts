/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSignUpValidation } from "./signup-validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { IValidation } from "../../presentation/helpers/validators/validation"
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-fields-validation"
import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../presentation/helpers/validators/email-validation"
import { IEmailValidator } from "../../presentation/protocols/email-validator"

jest.mock("../../presentation/helpers/validators/validation-composite")

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