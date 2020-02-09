import BaseException from "./BaseException";

export default class ServerFailedStartException extends BaseException {
    constructor(serverName) {
        super(`Server failed Start error, [${serverName}]`);
    }
}