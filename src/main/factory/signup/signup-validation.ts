import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from "../../../presentation/helpers/validators";
import { IValidation } from "../../../presentation/protocols/validation";
import EmailValidatorAdapter from "../../../utils/email-validator/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
        validations.push(new RequiredFieldValidation(pos))
    }
    validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
    const emailValidatorAdapter = new EmailValidatorAdapter()
    validations.push(new EmailValidation(emailValidatorAdapter, 'email'))
    return new ValidationComposite(validations)
}