import DbAddAccount from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { SignUpController } from "../../presentation/controllers/signup/signup"
import EmailValidatorAdapter from "../../utils/email-validator/email-validator-adapter"

export const makeSignUpController = (): SignUpController => {
    const salt = 12
    const emailValidator = new EmailValidatorAdapter()
    const encrypter = new BcryptAdapter(salt)
    const accountMongo = new AccountMongoRepository()
    const addAccount = new DbAddAccount(encrypter, accountMongo)
    return new SignUpController(emailValidator, addAccount) 
}