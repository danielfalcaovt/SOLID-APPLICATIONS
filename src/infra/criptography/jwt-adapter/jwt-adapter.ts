 
import { ITokenGenerator } from "../../../data/protocols/criptography/itoken-generator";
import jwt from 'jsonwebtoken'

export class JwtAdapter implements ITokenGenerator {
    constructor(private readonly secretKey: string) {}
    async generateToken(id: string): Promise<string> {
        const token = jwt.sign({ id }, this.secretKey)
        return new Promise(resolve => resolve(token))
    }
}