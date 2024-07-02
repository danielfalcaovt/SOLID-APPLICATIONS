import { HttpRequest } from "../protocols/http"
import { SignUpController } from "./signup"

describe('SignUp Controller', () => {
    test('Should return 400 if no name was provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('missing param: name'))
    })

    test('Should return 400 if no email was provided.', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('missing param: email'))
    })
    
    test('Should return 400 if no password was provided', () => {
        const sut = new SignUpController()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('missing param: password'))
    })
})