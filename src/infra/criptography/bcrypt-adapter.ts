import { IEncrypter } from "../../data/protocols/criptography/iencrypter";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypter {
    private readonly Salt: number
    constructor(salt: number) {
        this.Salt = salt
    }
    async encrypt(password: string): Promise<string> {
        const hashedValue = await bcrypt.hash(password, this.Salt)
        return new Promise(resolve => resolve(hashedValue))
    }
}