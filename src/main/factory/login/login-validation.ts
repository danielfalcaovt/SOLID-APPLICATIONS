import { EmailValidation, RequiredFieldValidation, ValidationComposite, } from "../../../presentation/helpers/validators";
import { IValidation } from "../../../presentation/protocols/validation";
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