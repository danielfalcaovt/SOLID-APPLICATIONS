/* eslint-disable @typescript-eslint/no-explicit-any */
import { IValidation } from "../../protocols/validation";

export class ValidationComposite implements IValidation  {
    private readonly validations: IValidation[]
    constructor (validations: IValidation[]) {
        this.validations = validations
    }
    validate(data: any): Error | null {
        for (const validation of this.validations) {
            const error = validation.validate(data)
            if (error) {
                return error
            }
        }
        return null
    }
}