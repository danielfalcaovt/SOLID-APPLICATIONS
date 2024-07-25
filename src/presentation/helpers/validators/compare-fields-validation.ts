/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError } from "../../errors";
import { IValidation } from "../../protocols/validation";

export class CompareFieldsValidation implements IValidation {
    constructor(private readonly firstField: string, private readonly secondField: string) {}
    validate(data: any): Error | null {
        if (data[this.firstField] !== data[this.secondField]) {
            return new InvalidParamError('confirmPassword')
        }
        return null
    }
}