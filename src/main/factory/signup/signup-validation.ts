import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-fields-validation";
import { IValidation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
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