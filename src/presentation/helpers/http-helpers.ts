/* eslint-disable @typescript-eslint/no-explicit-any */

import ServerError from "../errors/server-error"
import { HttpResponse } from "../protocols/http-protocols"

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
})

export const ok = (body: any): HttpResponse => ({
    statusCode: 200,
    body: body
})

export const serverError = (): HttpResponse => ({
    statusCode: 500,
    body: new ServerError()
})