/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IUpdateAccessToken {
    updateAccessToken(id: any, token: string): Promise<void>
}