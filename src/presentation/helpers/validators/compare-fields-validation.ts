/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError } from "../../errors";
import { IValidation } from "./validation";

export class CompareFieldsValidation implements IValidation {
    private readonly firstFieldName: string
    private readonly secondFieldName: string
    constructor(firstField: string, secondField: string) {
        this.firstFieldName = firstField
        this.secondFieldName = secondField
    }
    validate(data: any): Error | null {
        if (data[this.firstFieldName] !== data[this.secondFieldName]) {
            return new InvalidParamError('confirmPassword')
        }
        return null
    }
}