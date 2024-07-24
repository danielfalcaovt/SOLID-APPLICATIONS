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
})