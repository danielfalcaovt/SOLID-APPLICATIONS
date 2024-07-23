/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailValidation, RequiredFieldValidation } from "../../../presentation/helpers/validators"
import { IValidation } from "../../../presentation/protocols/validation"
import { IEmailValidator } from "../../../presentation/protocols/email-validator"
import { makeLoginValidation } from "./login-validation"

jest.mock("../../../presentation/helpers/validators/validation-composite")

describe('Login Validation', () => {
    it('Should call ValidationComposite with correct values', () => {
        makeLoginValidation()
        class EmailValidatorStub implements IEmailValidator {
            isValid(email: string): boolean {
                return true
            }
        }
        const emailValidatorStub = new EmailValidatorStub()
        const validations: IValidation[] = []
        for (const pos of ['name', 'password']) {
            validations.push(new RequiredFieldValidation(pos))
        }
        validations.push(new EmailValidation(emailValidatorStub,'email'))
    })
})