/* eslint-disable @typescript-eslint/no-unused-vars */
 
 

import MissingParamError from "../errors/missing-param-error"
import { badRequest, ok } from "../helpers/http-helpers"
import { HttpRequest, HttpResponse } from "../protocols/http-protocols"
import { Controller } from "../protocols/controller"
import IEmailValidator from "../protocols/email-validator"
import InvalidParamError from "../errors/invalid-param-error"

export class SignUpController implements Controller {
    private EmailValidator: IEmailValidator
    constructor(emailValidator: IEmailValidator) {
        this.EmailValidator = emailValidator
    }
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredParameters = ['name', 'email', 'password', 'confirmPassword']
        for (const pos of requiredParameters) {
            if (!httpRequest.body[pos]) {
                return badRequest(new MissingParamError(pos))  
            }
        }
        const { name, email, password, confirmPassword } = httpRequest.body
        const isValid = this.EmailValidator.isValid(email)
        if (!isValid) {
            return badRequest(new InvalidParamError('email'))
        }
        return ok('Cadastrado com Sucesso!')
    }
}