"use strict";
/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */
Object.defineProperty(exports, "__esModule", { value: true });
const KMSTool_1 = require("./KMSTool");
const https = require("https");
class KMSClient {
    constructor(endpoint, path, secretId, secretKey, method) {
        this.currentVersion = "SDK_NODEJS_1.0";
        this.endpoint = endpoint;
        this.path = path;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.method = method;
        this.signMethod = "RSA1";
    }
    setSignMethod(signMethod) {
        if (signMethod == "RSA1" || signMethod == "RSA2") {
            this.signMethod = signMethod;
        }
    }
    call(action, param) {
        let rsp = "";
        param["Action"] = action;
        param["Nonce"] = KMSTool_1.KMSTool.createNonceStr();
        param["Region"] = "ap-shanghai";
        param["SecretId"] = this.secretId;
        if (this.signMethod == "RSA2")
            param["SignatureMethod"] = "HmacSHA256";
        else
            param["SignatureMethod"] = "HmacSHA1";
        param["Timestamp"] = KMSTool_1.KMSTool.createTimestamp();
        const ret = KMSTool_1.KMSTool.encodeParams(param);
        const sign = KMSTool_1.KMSTool.sign(ret.unencode, this.secretKey, this.signMethod);
        console.log(sign);
        const fullPath = ret.encode + "&Signature=" + encodeURIComponent(sign);
        console.log(fullPath);
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.endpoint,
                path: this.path + "?" + fullPath,
            };
            https.get(options.hostname + options.path, res => {
                let body = "";
                res.on("data", chunk => {
                    body += chunk;
                });
                res.on("error", err => {
                    reject(err);
                });
                res.on("end", () => {
                    console.log(body);
                    resolve(body);
                });
            });
        });
    }
}
exports.KMSClient = KMSClient;
//# sourceMappingURL=KMSClient.js.map