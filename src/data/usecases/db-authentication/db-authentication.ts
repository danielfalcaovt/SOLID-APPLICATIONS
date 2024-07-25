import { AuthenticationModel, IAuthenticator } from "../../../domain/usecases/authentication"
import { IHashComparer } from "../../protocols/criptography/ihashcomparer"
import { ITokenGenerator } from "../../protocols/criptography/itoken-generator"
import { IUpdateAccessToken } from "../../protocols/db/iupdate-access-token"
import { ILoadAccountByEmail } from "../../protocols/db/load-account-by-email"

 
export class DbAuthentication implements IAuthenticator {
    private readonly UpdateAccessTokenRepo: IUpdateAccessToken
    private readonly LoadAccountByEmail: ILoadAccountByEmail
    private readonly TokenGenerator: ITokenGenerator
    private readonly HashComparer: IHashComparer
    constructor(updateAccessTokenRepo: IUpdateAccessToken, loadAccountByEmail: ILoadAccountByEmail, tokenGenerator: ITokenGenerator, hashComparer: IHashComparer) {
        this.UpdateAccessTokenRepo = updateAccessTokenRepo
        this.LoadAccountByEmail = loadAccountByEmail
        this.TokenGenerator = tokenGenerator
        this.HashComparer = hashComparer
    }
    async auth(authentication: AuthenticationModel): Promise<string | null> {
        const account = await this.LoadAccountByEmail.load(authentication.email)
        if (!account) {
            return new Promise(resolve =>resolve(null))
        }
        const result = await this.HashComparer.compare(authentication.password, account.password)
        if (!result) {
            return new Promise(resolve => resolve(null))
        }
        const accessToken = await this.TokenGenerator.generateToken(account.id)
        if (!accessToken) {
            return new Promise(resolve =>resolve('any_token'))
        }
        await this.UpdateAccessTokenRepo.update(account.id, accessToken)
        return new Promise(resolve => resolve(accessToken))
    }
}