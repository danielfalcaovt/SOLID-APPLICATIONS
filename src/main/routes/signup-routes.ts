import { Request, Response, Router } from "express";

export default (router: Router) => {
    router.post('/signup', (req: Request, res: Response) => {
        res.status(200).json({ ok: "ok" })
    })
}