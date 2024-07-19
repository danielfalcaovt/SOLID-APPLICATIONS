import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest, InvalidParamError, ok } from "../signup/signup-protocols";

export class LoginController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredParameters = ['email', 'password']
        for (const pos of requiredParameters) {
            if (!httpRequest.body[pos]) {
                return new Promise(resolve => resolve(badRequest(new InvalidParamError(pos))))
            }
        }
        return new Promise(resolve => resolve(ok('')))
    }
}