import BaseException from "./BaseException";

export default class AppMisconfigurationException extends BaseException {
    constructor(configs = []) {
        super(`Application Miss configuration error, [${configs.join()}]`);
    }
}