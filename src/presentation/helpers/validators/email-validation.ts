/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError } from "../../errors";
import { IEmailValidator } from "../../protocols/email-validator";
import { IValidation } from "./validation";

export class EmailValidation implements IValidation {
    private readonly EmailValidator: IEmailValidator
    private readonly fieldName: string
    constructor(EmailValidator: IEmailValidator, fieldName: string) {
        this.EmailValidator = EmailValidator
        this.fieldName = fieldName
    }
    validate(data: any): Error | null {
        const isValid = this.EmailValidator.isValid(data[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }
        return null
    }
}