import DbAddAccount from "../../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account"
import { LogErrorRepository } from "../../../infra/db/mongodb/log-repository/log"
import { SignUpController } from "../../../presentation/controllers/signup/signup"
import { Controller } from "../../../presentation/protocols"
import { LogDecorator } from "../../decorators/log"
import { makeSignUpValidation } from "./signup-validation"

export const makeSignUpController = (): Controller => {
    const salt = 12
    const encrypter = new BcryptAdapter(salt)
    const accountMongo = new AccountMongoRepository()
    const addAccount = new DbAddAccount(encrypter, accountMongo)
    const logErrorRepository = new LogErrorRepository()
    const signupController = new SignUpController(addAccount, makeSignUpValidation())
    return new LogDecorator(signupController, logErrorRepository)
}