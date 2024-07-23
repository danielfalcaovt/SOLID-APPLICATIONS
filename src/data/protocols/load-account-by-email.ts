import AccountModel from "../../domain/models/account";

export interface ILoadAccountByEmail {
    load (email: string): Promise<AccountModel>
}