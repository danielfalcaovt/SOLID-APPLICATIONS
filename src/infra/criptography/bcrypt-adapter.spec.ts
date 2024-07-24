import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => {
            resolve('hashed_value')
        })
    },
    async compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter(salt)
    return sut
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const sut = makeSut()
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('Should return hash on ok', async () => {
        const sut = makeSut()
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hashed_value')
    })
    test('Should throw if bcrypt throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementation(async () => Promise.reject(new Error()))
        /*         
        jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
            return Promise.reject(new Error())
        }) 
        */
        const promise = sut.encrypt('any_value')
        await expect(promise).rejects.toThrow()
    })
    test('Should call compare with correct values', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
})