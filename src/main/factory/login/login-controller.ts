import { DbAuthentication } from "../../../data/usecases/db-authentication/db-authentication"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account"
import { LogErrorRepository } from "../../../infra/db/mongodb/log-repository/log"
import { LoginController } from "../../../presentation/controllers/login/login"
import { Controller } from "../../../presentation/protocols"
import { LogDecorator } from "../../decorators/log"
import { makeLoginValidation } from "./login-validation"
import env from "../../config/env"

export const makeLoginController = (): Controller => {
    const logErrorRepository = new LogErrorRepository()
    const AccountMongo = new AccountMongoRepository()
    const bcryptAdapter = new BcryptAdapter(12)
    const jwtAdapter = new JwtAdapter(env.SECRET_KEY)
    const dbAuthentication = new DbAuthentication(AccountMongo, AccountMongo, jwtAdapter, bcryptAdapter)
    const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
    return new LogDecorator(loginController, logErrorRepository)
}