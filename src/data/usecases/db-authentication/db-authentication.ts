import { AuthenticationModel, IAuthenticator } from "../../../domain/usecases/authentication"
import { ILoadAccountByEmail } from "../../protocols/load-account-by-email"

/* eslint-disable @typescript-eslint/no-explicit-any */
export class DbAuthentication implements IAuthenticator {
    private readonly UpdateAccessTokenRepo: any
    private readonly LoadAccountByEmail: ILoadAccountByEmail
    private readonly TokenGenerator: any
    private readonly HashComparer: any
    constructor(updateAccessTokenRepo: any, loadAccountByEmail: ILoadAccountByEmail, tokenGenerator: any, hashComparer: any) {
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
        return new Promise(resolve =>resolve('any_token'))

    }
}