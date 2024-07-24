/* import { DbAuthentication } from "../../../data/usecases/db-authentication/db-authentication"
import { LogErrorRepository } from "../../../infra/db/mongodb/log-repository/log"
import { LoginController } from "../../../presentation/controllers/login/login"
import { Controller } from "../../../presentation/protocols"
import { LogDecorator } from "../../decorators/log"
import { makeLoginValidation } from "./login-validation"

export const makeLoginController = (): Controller => {
    const logErrorRepository = new LogErrorRepository()
    const dbAuthentication = new DbAuthentication(updateAccessToken, LoadAccountByEmail, TokenGenerator, HashComparer)
    const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
    return new LogDecorator(loginController, logErrorRepository)
} */