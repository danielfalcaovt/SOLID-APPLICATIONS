export interface AuthenticationModel {
    email: string
    password: string
}

export interface IAuthenticator {
    auth (authentication: AuthenticationModel): Promise<string | null>
}