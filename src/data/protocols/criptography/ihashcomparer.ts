export interface IHashComparer {
    compare(password: string, hash: string): Promise<boolean>
}