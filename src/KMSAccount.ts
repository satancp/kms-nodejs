/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */
import { KMSClient } from "./KMSClient";
import { KeyMetadata } from "./KeyMetadata.interface";
import { KMSServerError } from "./KMSServerError";
import { KMSTool } from "./KMSTool";

export class KMSAccount {
    client: KMSClient;

    constructor(secretId: string, secretKey: string, endpoint: string, path: string, method: string) {
        this.client = new KMSClient(endpoint, path, secretId, secretKey, method);
    }

    setSignMethod(signMethod: string): void {
        this.client.setSignMethod(signMethod);
    }

    async createKey(description: string, alias: string, keyUsage: string): Promise<KeyMetadata> {
        let param: any = {};
        param["description"] = description;
        param["alias"] = alias;
        param["keyUsage"] = keyUsage;
        const result: string = await this.client.call("CreateKey", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        const metaObj = JSON.parse(jsonObj["keyMetadata"]);
        const meta: KeyMetadata = {
            keyId: metaObj["keyId"],
            createTime: metaObj["createTime"],
            description: metaObj["description"],
            keyState: metaObj["keyState"],
            alias: metaObj["alias"],
            keyUsage: metaObj["keyUsage"],
            deleteTime: undefined,
        };
        return meta;
    }

    async generateDataKey(
        keyId: string,
        keySpec: string,
        numberOfBytes: number,
        encryptionContext: string,
        plaintext: string
    ): Promise<string> {
        let param: any = {};
        param["keyId"] = keyId;
        param["keySpec"] = keySpec;
        param["numberOfBytes"] = numberOfBytes.toString();
        if (encryptionContext) param["encryptionContext"] = encryptionContext;
        const result: string = await this.client.call("GenerateDataKey", param);
        const jsonObj = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        const realPlaintext = KMSTool.decodeBase64(jsonObj["plaintext"]);
        return jsonObj["ciphertextBlob"];
    }

    async encrypt(keyId: string, plaintext: string, encryptionContext: string): Promise<string> {
        let param: any = {};
        param["keyId"] = keyId;
        param["plaintext"] = new Buffer(plaintext).toString("base64");
        if (encryptionContext) param["encryptionContext"] = encryptionContext;
        const result: string = await this.client.call("Encrypt", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        return jsonObj["ciphertextBlob"];
    }

    async decrypt(ciphertextBlob: string, encryptionContext: string): Promise<string> {
        let param: any = {};
        param["ciphertextBlob"] = ciphertextBlob;
        if (encryptionContext) param["encryptionContext"] = encryptionContext;
        const result: string = await this.client.call("Decrypt", param);
        const jsonObj = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        return KMSTool.decodeBase64(jsonObj["plaintext"]);
    }

    async listKey(offset: number, limit: number, keyList: Array<string>): Promise<void> {
        const param: any = {};
        if (offset > 0) param["offset"] = offset.toString();
        if (limit > 0) param["limit"] = limit.toString();
        const result: string = await this.client.call("ListKey", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        const jsonArray: Array<object> = jsonObj["keys"];
        for (let i = 0; i < jsonArray.length; ++i) {
            const obj: any = jsonArray[i];
            keyList.push(obj["keyId"]);
        }
    }

    async disableKey(keyId: string): Promise<void> {
        const param: any = {};
        if (keyId) param["keyId"] = keyId;
        const result: string = await this.client.call("DisableKey", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
    }

    async enableKey(keyId: string): Promise<void> {
        const param: any = {};
        if (keyId) param["keyId"] = keyId;
        const result: string = await this.client.call("EnableKey", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
    }

    async getKeyAttributes(keyId: string): Promise<KeyMetadata> {
        let param: any = {};
        if (keyId) param["keyId"] = keyId;
        const result: string = await this.client.call("GetKeyAttributes", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        const metaObj: any = JSON.parse(jsonObj["keyMetadata"]);
        const meta: KeyMetadata = {
            keyId: metaObj["keyId"],
            createTime: metaObj["createTime"],
            description: metaObj["description"],
            keyState: metaObj["keyState"],
            alias: metaObj["alias"],
            keyUsage: metaObj["keyUsage"],
            deleteTime: metaObj["deleteTime"],
        };
        return meta;
    }

    async setKeyAttributes(keyId: string, alias: string): Promise<void> {
        let param: any = {};
        param["keyId"] = keyId;
        param["alias"] = alias;
        const result: string = await this.client.call("SetKeyAttributes", param);
        const jsonObj: any = JSON.parse(result);
        const code: number = jsonObj["code"];
        if (code != 0) throw new KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
    }
}
