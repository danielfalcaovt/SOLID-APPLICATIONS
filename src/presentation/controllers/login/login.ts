/* eslint-disable @typescript-eslint/no-explicit-any */

import { Controller, HttpRequest, HttpResponse  } from './login-protocols'
import { IAuthenticator } from "../../../domain/usecases/authentication";
import { badRequest, IValidation, ok, serverError, unauthorized } from "../signup/signup-protocols";

export class LoginController implements Controller {
    constructor(private readonly validator: IValidation, private readonly authenticator: IAuthenticator) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(httpRequest.body)
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