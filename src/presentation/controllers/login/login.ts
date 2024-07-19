/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest, IEmailValidator, InvalidParamError, MissingParamError, ok, serverError } from "../signup/signup-protocols";

export class LoginController implements Controller {
    private readonly emailValidator: IEmailValidator
    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try 
        {
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
            return new Promise(resolve => resolve(ok('')))
        }catch(error: any) {
            return new Promise(resolve => {
                resolve(serverError(error))
            })
        }
    }
}