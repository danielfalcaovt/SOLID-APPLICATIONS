import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

export class LogDecorator implements Controller {
    private readonly controller: Controller
    constructor(controller: Controller) {
        this.controller = controller
    }
    async handle(HttpRequest: HttpRequest): Promise<HttpResponse>{
        const httpResponse = await this.controller.handle(HttpRequest)
        if (httpResponse.statusCode === 500) {
            // log
        }
        return httpResponse
    }
}