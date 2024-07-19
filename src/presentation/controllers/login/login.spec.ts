import { LoginController } from "./login"

describe('Login Controller', () => {
    it('Should return 400 if no email was provided', async () => {
        const sut = new LoginController()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})