import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock('jsonwebtoken', () => ({
    sign(): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    }
}))

const makeSut = (): JwtAdapter => {
    const sut = new JwtAdapter('secret')
    return sut
}

describe('Jwt Adapter', () => {
    it('Should call sign with correct values', async () => {
        const sut = makeSut()
        const jwtSpy = jest.spyOn(jwt, 'sign')
        await sut.generate('any_id')
        expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
    it('Should throw if generate throws', async () => {
        const sut = makeSut()
        jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => Promise.reject(new Error()))
        const promise = sut.generate('any_key')
        expect(promise).rejects.toThrow()
    })
    it('Should return a token on success', async () => {
        const sut = makeSut()
        const token = await sut.generate('any_id')
        expect(token).toBe('any_token')
    })
})