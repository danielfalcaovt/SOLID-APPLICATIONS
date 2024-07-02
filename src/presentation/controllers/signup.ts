/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import MissingParamError from "../errors/missing-param-error"

export class SignUpController {
    handle(httpRequest: any): any {
        const requiredParameters = ['username', 'email', 'password', 'confirmPassword']
        for (const pos of requiredParameters) {
            if (!httpRequest.body[pos]) {
                return new Error("missing param")
            }
        }
        return {
            statusCode: 400
        }
    }
}