 
import { ITokenGenerator } from "../../../data/protocols/criptography/itoken-generator";
import jwt from 'jsonwebtoken'

export class JwtAdapter implements ITokenGenerator {
    private readonly secretKey: string
    constructor(secretKey: string) {
        this.secretKey = secretKey
    }
    async generate(id: string): Promise<string> {
        await jwt.sign({ id }, this.secretKey)
        return new Promise(resolve => resolve('nasid'))
    }
}