import { InvalidParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

describe('CompareFields Validation', () => {
    it('Should return an error if validation fail', () => {
        const sut = new CompareFieldsValidation('firstField', 'secondField')
        const error = sut.validate({firstField: 'any_value', secondField: 'different_value'})
        expect(error).toEqual(new InvalidParamError('confirmPassword'))
    })
    it('Should not return on succeeds', () => {
        const sut = new CompareFieldsValidation('firstField', 'secondField')
        const error = sut.validate({firstField: 'any_value', secondField: 'any_value'})
        expect(error).toBeFalsy()
    })
})