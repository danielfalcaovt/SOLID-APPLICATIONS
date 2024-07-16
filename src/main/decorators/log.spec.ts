/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogDecorator } from "./log"

interface SutTypes {
    sut: LogDecorator
    ControllerStub: Controller
}

const makeSut = (): SutTypes => {
    class controllerStub implements Controller {
        handle(HttpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => {
                resolve({
                    statusCode: 200,
                    body: {
                        id: 'valid_id',
                        name: 'valid_name',
                        email: 'valid_mail',
                        password: 'valid_password'
                    }
                })
            })
        }
    }
    const ControllerStub = new controllerStub()
    const sut = new LogDecorator(ControllerStub)
    return {
        sut,
        ControllerStub
    }
}

describe('LogController Decorator', () => {
    test('Should call controller with correct value', async () => {
        const { sut, ControllerStub } = makeSut()
        const ControllerSpy = jest.spyOn(ControllerStub, 'handle')
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