 

import { MissingParamError, InvalidParamError } from "../errors"
import { badRequest, ok, serverError } from "../helpers/http-helpers"
import { HttpRequest, HttpResponse } from "../protocols/http-protocols"
import { Controller } from "../protocols/controller"
import IEmailValidator from "../protocols/email-validator"
import { IAddAccount } from "../../domain/usecases/add-account"

export class SignUpController implements Controller {
    private EmailValidator: IEmailValidator
    private AddAccount: IAddAccount
    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
        this.EmailValidator = emailValidator
        this.AddAccount = addAccount
    }
    handle(httpRequest: HttpRequest): HttpResponse {
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
            this.AddAccount.add({name, email, password})
            return ok('Cadastrado com Sucesso!')
        } catch(err) {
            return serverError()
        }
    }
}