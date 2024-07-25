export interface ITokenGenerator {
    generateToken(id: string): Promise<string>
}