export interface IUpdateAccessToken {
    update(id: string, token: string): Promise<void>
}