/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParamError } from "../../errors";
import { IValidation } from "./validation";

export class RequiredFieldValidation implements IValidation {
    private readonly fieldName: string
    constructor(fieldName: string) {
        this.fieldName = fieldName
    }
    validate(data: any): Error | null {
        if (!data[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }
        return null
    }
}