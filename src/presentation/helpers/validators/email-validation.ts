/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError } from "../../errors";
import { IEmailValidator } from "../../protocols/email-validator";
import { IValidation } from "../../protocols/validation";

export class EmailValidation implements IValidation {
    constructor(
        private readonly EmailValidator: IEmailValidator, 
        private readonly fieldName: string
    ) {}
    validate(data: any): Error | null {
        const isValid = this.EmailValidator.isValid(data[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }
        return null
    }
}