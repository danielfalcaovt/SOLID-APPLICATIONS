/* eslint-disable @typescript-eslint/no-explicit-any */

import { Controller, HttpRequest, HttpResponse  } from './login-protocols'
import { IAuthenticator } from "../../../domain/usecases/authentication";
import { badRequest, IValidation, ok, serverError, unauthorized } from "../signup/signup-protocols";

export class LoginController implements Controller {
    private readonly Validator: IValidation
    private readonly authenticator: IAuthenticator
    constructor(validator: IValidation, authenticator: IAuthenticator) {
        this.authenticator = authenticator
        this.Validator = validator
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.Validator.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { email, password } = httpRequest.body
            const auth = await this.authenticator.auth({ email, password })
            if (!auth) {
                return new Promise(resolve => resolve(unauthorized()))
            }
            return new Promise(resolve => resolve(ok(auth)))
        }catch(error: any) {
            return new Promise(resolve => {
                resolve(serverError(error))
            })
        }
    }
}