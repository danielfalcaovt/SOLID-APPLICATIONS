import MissingParamError from "../errors/missing-param-error"
import { HttpRequest } from "../protocols/http-protocols"
import { SignUpController } from "./signup"

const makeSut = () => {
    return new SignUpController()
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name was provided', () => {
        const sut = makeSut()
        const httpRequest = {
            body: {
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email was provided.', () => {
        const sut = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
    
    test('Should return 400 if no password was provided', () => {
        const sut = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
    test('Should return 400 if no confirmation password was provided', () => {
        const sut = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
    })
    test('Should return 400 if an invalid email was provided', () => {
        const sut = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('password'))
    })
    
})