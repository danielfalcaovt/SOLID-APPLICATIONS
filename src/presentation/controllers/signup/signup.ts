/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, HttpRequest, HttpResponse, IAddAccount, IValidation  } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helpers'

export class SignUpController implements Controller {
    private AddAccount: IAddAccount
    private Validation: IValidation // VALIDATION COMPOSITE

    constructor(addAccount: IAddAccount, validation: IValidation) {
        this.AddAccount = addAccount
        this.Validation = validation
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.Validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password} = httpRequest.body
            const account = await this.AddAccount.add({name, email, password})
            return ok(account)
        } catch(err: any) {
            return serverError(err)
        }
    }
}