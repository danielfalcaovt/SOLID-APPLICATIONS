import { makeSignUpValidation } from "./signup-validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { IValidation } from "../../presentation/helpers/validators/validation"
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-fields-validation"

jest.mock("../../presentation/helpers/validators/validation-composite")

describe('SignUpValidation Factory', () => {
    it('Should call ValidationComposite with correct values', () => {
        makeSignUpValidation()
        const validations: IValidation[] = []
        for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
            validations.push(new RequiredFieldValidation(pos))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})