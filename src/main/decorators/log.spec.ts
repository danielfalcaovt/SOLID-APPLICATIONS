/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServerError } from "../../presentation/errors/server-error"
import { serverError } from "../../presentation/helpers/http/http-helpers"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { ILog } from "../../data/protocols/ILog"
import { LogDecorator } from "./log"

interface SutTypes {
    sut: LogDecorator
    ControllerStub: Controller
    LogErrorRepositoryStub: ILog
}

const makeControllerStub = (): Controller => {
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
    return ControllerStub
}

const makeRepositoryStub = (): ILog => {
    class RepositoryStub implements ILog {
        async logError(stack: string): Promise<void> {
            return new Promise(resolve=>resolve())
        }
    }
    const repositoryStub = new RepositoryStub()
    return repositoryStub
}

const makeSut = (): SutTypes => {
    const ControllerStub = makeControllerStub()
    const LogErrorRepositoryStub = makeRepositoryStub()
    const sut = new LogDecorator(ControllerStub, LogErrorRepositoryStub)
    return {
        sut,
        ControllerStub,
        LogErrorRepositoryStub
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
    test('Should call LogErrorRepository with correct error if controller return server error', async () => {
        const { sut, ControllerStub, LogErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        jest.spyOn(ControllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))
        const LogSpy = jest.spyOn(LogErrorRepositoryStub, 'logError')
        const httpRequest = {
            body: {
                email: 'any_mail',
                name: 'any_name',
                password: 'any_password',
                confirmPassword: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(LogSpy).toHaveBeenCalledWith(fakeError.stack)
    })
})