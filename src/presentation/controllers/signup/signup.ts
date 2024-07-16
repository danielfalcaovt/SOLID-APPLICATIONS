/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, HttpRequest, HttpResponse, IAddAccount, IEmailValidator  } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
    private EmailValidator: IEmailValidator
    private AddAccount: IAddAccount
    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
        this.EmailValidator = emailValidator
        this.AddAccount = addAccount
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredParameters = ['name', 'email', 'password', 'confirmPassword']
            for (const pos of requiredParameters) {
                if (!httpRequest.body[pos]) {
                    return badRequest(new MissingParamError(pos))  
                }
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