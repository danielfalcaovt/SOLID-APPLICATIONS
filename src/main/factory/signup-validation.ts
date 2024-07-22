import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-fields-validation";
import { IValidation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
        validations.push(new RequiredFieldValidation(pos))
    }
    return new ValidationComposite(validations)
}