 
 

import MissingParamError from "../errors/missing-param-error"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredParameters = ['name', 'email', 'password', 'confirmPassword']
        for (const pos of requiredParameters) {
            if (!httpRequest.body[pos]) {
                return {
                    statusCode: 400,
                    body: new MissingParamError(`missing param: ${pos}`)
                }   
            }
        }
        return {
            statusCode: 200,
            body: ''
        }
    }
}