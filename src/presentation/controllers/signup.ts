 
 

import MissingParamError from "../errors/missing-param-error"
import { badRequest, ok } from "../helpers/http-helpers"
import { HttpRequest, HttpResponse } from "../protocols/http-protocols"
import { Controller } from "../protocols/controller"

export class SignUpController implements Controller {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredParameters = ['name', 'email', 'password', 'confirmPassword']
        for (const pos of requiredParameters) {
            if (!httpRequest.body[pos]) {
                return badRequest(new MissingParamError(pos))  
            }
        }
        return ok('Cadastrado com Sucesso!')
    }
}