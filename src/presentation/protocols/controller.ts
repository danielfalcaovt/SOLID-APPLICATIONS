import { HttpRequest, HttpResponse } from "./http-protocols";

export interface Controller {
    handle: (HttpRequest: HttpRequest) => HttpResponse
}