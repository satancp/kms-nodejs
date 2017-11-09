export class KMSServerError extends Error {
    errorCode: number = 0;
    errorMessage: string = "";
    requestId: string = "";

    constructor(errorCode: number, errorMessage: string, requestId: string) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.requestId = requestId;
    }
}
