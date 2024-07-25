import { Router } from "express";
import { AdaptRoute } from "../../adapters/signup-adapter";
import { makeLoginController } from "../../factory/login/login-controller";

export default (router: Router) => {
    const loginController = makeLoginController()
    router.post('/login', AdaptRoute(loginController))
}