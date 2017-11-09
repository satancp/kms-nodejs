/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */

import { KMSTool } from "./KMSTool";
import * as https from "https";
import { KMSClient as KMSClientInterface } from "./KMSClient.interface";

export class KMSClient implements KMSClientInterface {
    endpoint: string;
    path: string;
    secretId: string;
    secretKey: string;
    method: string;
    signMethod: string;
    currentVersion: string = "SDK_NODEJS_1.0";

    constructor(endpoint: string, path: string, secretId: string, secretKey: string, method: string) {
        this.endpoint = endpoint;
        this.path = path;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.method = method;
        this.signMethod = "RSA1";
    }

    setSignMethod(signMethod: string): void {
        if (signMethod == "RSA1" || signMethod == "RSA2") {
            this.signMethod = signMethod;
        }
    }

    call(action: string, param: any): Promise<string> {
        let rsp: string = "";
        param["Action"] = action;
        param["Nonce"] = KMSTool.createNonceStr();
        param["Region"] = "ap-shanghai";
        param["SecretId"] = this.secretId;
        if (this.signMethod == "RSA2") param["SignatureMethod"] = "HmacSHA256";
        else param["SignatureMethod"] = "HmacSHA1";
        param["Timestamp"] = KMSTool.createTimestamp();
        const ret = KMSTool.encodeParams(param);
        const sign = KMSTool.sign(ret.unencode, this.secretKey, this.signMethod);
        console.log(sign);
        const fullPath = ret.encode + "&Signature=" + encodeURIComponent(sign);
        console.log(fullPath);
        return new Promise<string>((resolve, reject) => {
            const options: any = {
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
