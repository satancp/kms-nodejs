"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KMSServerError extends Error {
    constructor(errorCode, errorMessage, requestId) {
        super(errorMessage);
        this.errorCode = 0;
        this.errorMessage = "";
        this.requestId = "";
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.requestId = requestId;
    }
}
exports.KMSServerError = KMSServerError;
//# sourceMappingURL=KMSServerError.js.map