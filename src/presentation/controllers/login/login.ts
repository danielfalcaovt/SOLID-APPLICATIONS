/* eslint-disable @typescript-eslint/no-explicit-any */

import { Controller, HttpRequest, HttpResponse, IEmailValidator  } from './login-protocols'
import { IAuthenticator } from "../../../domain/usecases/authentication";
import { badRequest, InvalidParamError, MissingParamError, ok, serverError, unauthorized } from "../signup/signup-protocols";

export class LoginController implements Controller {
    private readonly emailValidator: IEmailValidator
    private readonly authenticator: IAuthenticator
    constructor(emailValidator: IEmailValidator, authenticator: IAuthenticator) {
        this.emailValidator = emailValidator
        this.authenticator = authenticator
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredParameters = ['email', 'password']
            for (const pos of requiredParameters) {
                if (!httpRequest.body[pos]) {
                    return new Promise(resolve => resolve(badRequest(new MissingParamError(pos))))
                }
            }
            const { email, password } = httpRequest.body
            if (!this.emailValidator.isValid(email)) {
                return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
            }

            const auth = await this.authenticator.auth(email, password)
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