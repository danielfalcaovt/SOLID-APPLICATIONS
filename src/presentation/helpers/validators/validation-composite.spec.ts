/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-fields-validation"
import { IValidation } from "../../protocols/validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
    sut: ValidationComposite
    validations: IValidation[]
}

const makeSut = (): SutTypes => {
    const validations: IValidation[] = []
    validations.push(makeValidationStub())
    validations.push(makeValidationStub())
    const sut = new ValidationComposite(validations)
    return {
        sut,
        validations
    }
}

const makeValidationStub = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(data: any): Error | null {
            return null
        }
    }
    const validationStub = new ValidationStub()
    return validationStub
}

describe('Validation Composite', () => {
    it('Should return an error if any validation fail', () => {
        const { sut, validations } = makeSut()
        jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
        const response = sut.validate({ field: 'any_value' })
        expect(response).toEqual(new MissingParamError('any_param'))
    })
    it('Should return the first error received', () => {
        const { sut, validations } = makeSut()
        jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new MissingParamError('first_error'))
        jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new MissingParamError('second_error'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('first_error'))
    })
    it('Should not return if no one validation fail', () => {
        const { sut } = makeSut()
        const response = sut.validate({data: 'any_data'})
        expect(response).toBeFalsy()
    })
})