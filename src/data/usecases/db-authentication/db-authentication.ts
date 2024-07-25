import { AuthenticationModel, IAuthenticator } from "../../../domain/usecases/authentication"
import { IHashComparer } from "../../protocols/criptography/ihashcomparer"
import { ITokenGenerator } from "../../protocols/criptography/itoken-generator"
import { IUpdateAccessToken } from "../../protocols/db/iupdate-access-token"
import { ILoadAccountByEmail } from "../../protocols/db/load-account-by-email"

 
export class DbAuthentication implements IAuthenticator {
    constructor(
        private readonly updateAccessTokenRepo: IUpdateAccessToken, 
        private readonly loadAccountByEmail: ILoadAccountByEmail, 
        private readonly tokenGenerator: ITokenGenerator, 
        private readonly hashComparer: IHashComparer
    ){}
    async auth(authentication: AuthenticationModel): Promise<string | null> {
        const account = await this.loadAccountByEmail.loadByEmail(authentication.email)
        if (!account) {
            return new Promise(resolve =>resolve(null))
        }
        const result = await this.hashComparer.compare(authentication.password, account.password)
        if (!result) {
            return new Promise(resolve => resolve(null))
        }
        const accessToken = await this.tokenGenerator.generateToken(account.id)
        if (!accessToken) {
            return new Promise(resolve =>resolve(null))
        }
        await this.updateAccessTokenRepo.updateAccessToken(account.id, accessToken)
        return new Promise(resolve => resolve(accessToken))
    }
}