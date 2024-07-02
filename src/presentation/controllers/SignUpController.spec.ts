import { SignUpController } from "./signup"

describe('SignUp Controller', () => {
    test('Should return 400 if no name was provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})