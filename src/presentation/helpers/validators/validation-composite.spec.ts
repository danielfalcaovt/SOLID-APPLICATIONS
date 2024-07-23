/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequiredFieldValidation } from "./required-fields-validation"
import { IValidation } from "./validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
    sut: ValidationComposite
    validationStub: IValidation
}

const makeSut = (): SutTypes => {
    const validations: IValidation[] = []
    class ValidationStub implements IValidation {
        validate(data: any): Error | null {
            return null
        }
    }
    const validationStub = new ValidationStub()
    validations.push(validationStub)
    const sut = new ValidationComposite(validations)
    return {
        sut,
        validationStub
    }
}

describe('Validation Composite', () => {
    it('Should return an error if any test fail', () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const response = sut.validate({ field: 'any_value' })
        expect(response).toEqual(new Error())
    })
    it('Should not return if no one test fail', () => {
        const { sut } = makeSut()
        const response = sut.validate({data: 'any_data'})
        expect(response).toBeFalsy()
    })
})