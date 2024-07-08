import { Controller, HttpRequest, HttpResponse, IAddAccount, InvalidParamError, MissingParamError, badRequest, ok, serverError, IEmailValidator  } from './signup-protocols'

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