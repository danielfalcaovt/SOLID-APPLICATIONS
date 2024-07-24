import { IEncrypter } from "../../../data/protocols/criptography/iencrypter";
import bcrypt from 'bcrypt'
import { IHashComparer } from "../../../data/protocols/criptography/ihashcomparer";

export class BcryptAdapter implements IEncrypter, IHashComparer {
    private readonly Salt: number
    constructor(salt: number) {
        this.Salt = salt
    }
    async encrypt(password: string): Promise<string> {
        const hashedValue = await bcrypt.hash(password, this.Salt)
        return new Promise(resolve => resolve(hashedValue))
    }
    async compare(password: string, hash: string): Promise<boolean> {
        const result = await bcrypt.compare(password, hash)
        return new Promise(resolve => resolve(result))
    }
}