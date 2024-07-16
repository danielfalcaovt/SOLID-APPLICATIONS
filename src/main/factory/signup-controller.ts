import DbAddAccount from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { SignUpController } from "../../presentation/controllers/signup/signup"
import { Controller } from "../../presentation/protocols"
import EmailValidatorAdapter from "../../utils/email-validator/email-validator-adapter"
import { LogDecorator } from "../decorators/log"

export const makeSignUpController = (): Controller => {
    const salt = 12
    const emailValidator = new EmailValidatorAdapter()
    const encrypter = new BcryptAdapter(salt)
    const accountMongo = new AccountMongoRepository()
    const addAccount = new DbAddAccount(encrypter, accountMongo)
    const signupController = new SignUpController(emailValidator, addAccount)
    return new LogDecorator(signupController)
}