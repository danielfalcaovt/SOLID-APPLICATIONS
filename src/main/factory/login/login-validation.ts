import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-fields-validation";
import { IValidation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import EmailValidatorAdapter from "../../../utils/email-validator/email-validator-adapter";

export const makeLoginValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const pos of ['email', 'password']) {
        validations.push(new RequiredFieldValidation(pos))
    }
    const emailValidator = new EmailValidatorAdapter()
    validations.push(new EmailValidation(emailValidator, 'email'))
    return new ValidationComposite(validations)
}