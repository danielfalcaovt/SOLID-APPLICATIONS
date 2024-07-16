/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogDecorator } from "./log"

describe('LogController Decorator', () => {
    test('Should call controller with correct value', async () => {
        class controllerStub implements Controller {
            handle(HttpRequest: HttpRequest): Promise<HttpResponse> {
                return new Promise(resolve => {
                    resolve({
                        statusCode: 200,
                        body: ''
                    })
                })
            }
        }
        const ControllerStub = new controllerStub()
        const ControllerSpy = jest.spyOn(ControllerStub, 'handle')
        const sut = new LogDecorator(ControllerStub)
        const httpRequest = {
            body: {
                email: 'any_mail',
                name: 'any_name',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(ControllerSpy).toHaveBeenCalledWith(httpRequest)
    })
})