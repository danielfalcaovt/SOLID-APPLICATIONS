import { Router } from "express";
import { makeSignUpController } from "../factory/signup/signup-controller";
import { AdaptRoute } from "../adapters/signup-adapter";

export default (router: Router) => {
    const signupController = makeSignUpController()
    router.post('/signup', AdaptRoute(signupController))
}