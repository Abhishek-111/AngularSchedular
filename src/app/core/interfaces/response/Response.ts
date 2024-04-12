import { IResponse } from "./IResponse";

export class Response implements IResponse {
    constructor(
        public message?: string,
        public statusCode?:number
        ) { }
}
  