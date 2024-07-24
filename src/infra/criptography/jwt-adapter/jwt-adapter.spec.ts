import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock('jsonwebtoken', () => ({
    sign(): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    }
}))

describe('Jwt Adapter', () => {
    it('Should call sign with correct values', async () => {
        const sut = new JwtAdapter('secret')
        const jwtSpy = jest.spyOn(jwt, 'sign')
        await sut.generate('any_id')
        expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
    it('Should throw if generate throws', async () => {
        const sut = new JwtAdapter('secret')
        jest.spyOn(jwt, 'sign').mockImplementation(async () => Promise.reject(new Error()))
        const promise = sut.generate('any_key')
        expect(promise).rejects.toThrow()
    })
})