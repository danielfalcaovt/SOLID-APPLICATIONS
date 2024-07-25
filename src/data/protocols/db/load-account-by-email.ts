import AccountModel from "../../../domain/models/account";

export interface ILoadAccountByEmail {
    loadByEmail (email: string): Promise<AccountModel | null>
}