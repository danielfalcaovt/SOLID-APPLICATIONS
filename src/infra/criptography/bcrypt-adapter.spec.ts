import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => {
            resolve('hashed_value')
        })
    }
}))

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('Should return hash on ok', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hashed_value')
    })
})