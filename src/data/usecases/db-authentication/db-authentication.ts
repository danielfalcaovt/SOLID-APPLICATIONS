import { AuthenticationModel, IAuthenticator } from "../../../domain/usecases/authentication"
import { IHashComparer } from "../../protocols/criptography/ihashcomparer"
import { ITokenGenerator } from "../../protocols/criptography/itoken-generator"
import { ILoadAccountByEmail } from "../../protocols/db/load-account-by-email"

/* eslint-disable @typescript-eslint/no-explicit-any */
export class DbAuthentication implements IAuthenticator {
    private readonly UpdateAccessTokenRepo: any
    private readonly LoadAccountByEmail: ILoadAccountByEmail
    private readonly TokenGenerator: ITokenGenerator
    private readonly HashComparer: IHashComparer
    constructor(updateAccessTokenRepo: any, loadAccountByEmail: ILoadAccountByEmail, tokenGenerator: ITokenGenerator, hashComparer: IHashComparer) {
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
        await this.TokenGenerator.generate(account.id)
        return new Promise(resolve =>resolve('any_token'))
    }
}