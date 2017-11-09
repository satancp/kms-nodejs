/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */

import * as crypto from "crypto";

export class KMSTool {
    static sign(str: any, privateKey: any, signType: any): string {
        let sha;
        if (signType === "RSA2") sha = crypto.createHmac("sha256", privateKey);
        else sha = crypto.createHmac("sha1", privateKey);
        sha.update(str);
        return sha.digest("base64");
    }

    static decodeBase64(content: any): string {
        return new Buffer(content, "base64").toString("utf8");
    }

    static createNonceStr(length?: any): string {
        length = length || 24;
        if (length > 32) length = 32;
        return (Math.random() * Number.MAX_SAFE_INTEGER + 1).toFixed(0);
    }

    static createTimestamp(): string {
        return (new Date().getTime() / 1000).toFixed(0);
    }

    static encodeParams(params: any): any {
        const keys = [];
        for (const k in params) {
            if (params.hasOwnProperty(k)) {
                if (params[k] !== undefined && params[k] !== "") {
                    keys.push(k);
                }
            }
        }
        keys.sort((a: string, b: string) => {
            return a.toUpperCase() > b.toUpperCase() ? 1 : -1;
        });
        let unencodeStr = "";
        let encodeStr = "";
        const len = keys.length;
        for (let i = 0; i < len; ++i) {
            const k = keys[i];
            if (i !== 0) {
                unencodeStr += "&";
                encodeStr += "&";
            }
            unencodeStr += k + "=" + params[k];
            encodeStr += k + "=" + encodeURIComponent(params[k]);
        }
        return { unencode: unencodeStr, encode: encodeStr };
    }
}
