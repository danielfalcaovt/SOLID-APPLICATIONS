import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-fields-validation"

describe('Required Fields Validation', () => {
    it('Should return false if missing param', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({name: 'any_name'})
        expect(error).toEqual(new MissingParamError('field'))
    })
})