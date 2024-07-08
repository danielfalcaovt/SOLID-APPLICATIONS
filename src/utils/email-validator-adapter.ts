/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEmailValidator } from "../presentation/protocols/email-validator";

export default class EmailValidatorAdapter implements IEmailValidator {
    isValid(email: string): boolean {
        return false
    }
}