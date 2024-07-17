import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { ILog } from "../../data/protocols/ILog";

export class LogDecorator implements Controller {
    private readonly controller: Controller
    private readonly logErrorRepository: ILog
    constructor(controller: Controller, logErrorRepository: ILog) {
        this.controller = controller
        this.logErrorRepository = logErrorRepository
    }
    async handle(HttpRequest: HttpRequest): Promise<HttpResponse>{
        const httpResponse = await this.controller.handle(HttpRequest)
        if (httpResponse.statusCode === 500) {
            this.logErrorRepository.log(httpResponse.body.stack)
        }
        return httpResponse
    }
}