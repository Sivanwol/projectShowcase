import BaseException from "./BaseException";

export default class ConfigException extends BaseException {
    constructor(filePath) {
        super(`Unable load system config: ${filePath}`);
    }
}