/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, HttpRequest, HttpResponse, IAddAccount, IEmailValidator, IValidation  } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
    private EmailValidator: IEmailValidator
    private AddAccount: IAddAccount
    private Validation: IValidation
    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount, validation: IValidation) {
        this.EmailValidator = emailValidator
        this.AddAccount = addAccount
        this.Validation = validation
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.Validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password, confirmPassword } = httpRequest.body
            if (password !== confirmPassword) {
                return badRequest(new InvalidParamError('confirmPassword'))
            }
            const isValid = this.EmailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            const account = await this.AddAccount.add({name, email, password})
            return ok(account)
        } catch(err: any) {
            return serverError(err)
        }
    }
}