export interface IUpdateAccessToken {
    updateAccessToken(id: string, token: string): Promise<void>
}