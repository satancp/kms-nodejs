"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */
const KMSClient_1 = require("./KMSClient");
const KMSServerError_1 = require("./KMSServerError");
const KMSTool_1 = require("./KMSTool");
class KMSAccount {
    constructor(secretId, secretKey, endpoint, path, method) {
        this.client = new KMSClient_1.KMSClient(endpoint, path, secretId, secretKey, method);
    }
    setSignMethod(signMethod) {
        this.client.setSignMethod(signMethod);
    }
    createKey(description, alias, keyUsage) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {};
            param["description"] = description;
            param["alias"] = alias;
            param["keyUsage"] = keyUsage;
            const result = yield this.client.call("CreateKey", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
            const metaObj = JSON.parse(jsonObj["keyMetadata"]);
            const meta = {
                keyId: metaObj["keyId"],
                createTime: metaObj["createTime"],
                description: metaObj["description"],
                keyState: metaObj["keyState"],
                alias: metaObj["alias"],
                keyUsage: metaObj["keyUsage"],
                deleteTime: undefined,
            };
            return meta;
        });
    }
    generateDataKey(keyId, keySpec, numberOfBytes, encryptionContext, plaintext) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {};
            param["keyId"] = keyId;
            param["keySpec"] = keySpec;
            param["numberOfBytes"] = numberOfBytes.toString();
            if (encryptionContext)
                param["encryptionContext"] = encryptionContext;
            const result = yield this.client.call("GenerateDataKey", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
            const realPlaintext = KMSTool_1.KMSTool.decodeBase64(jsonObj["plaintext"]);
            return jsonObj["ciphertextBlob"];
        });
    }
    encrypt(keyId, plaintext, encryptionContext) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {};
            param["keyId"] = keyId;
            param["plaintext"] = new Buffer(plaintext).toString("base64");
            if (encryptionContext)
                param["encryptionContext"] = encryptionContext;
            const result = yield this.client.call("Encrypt", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
            return jsonObj["ciphertextBlob"];
        });
    }
    decrypt(ciphertextBlob, encryptionContext) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {};
            param["ciphertextBlob"] = ciphertextBlob;
            if (encryptionContext)
                param["encryptionContext"] = encryptionContext;
            const result = yield this.client.call("Decrypt", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
            return KMSTool_1.KMSTool.decodeBase64(jsonObj["plaintext"]);
        });
    }
    listKey(offset, limit, keyList) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = {};
            if (offset > 0)
                param["offset"] = offset.toString();
            if (limit > 0)
                param["limit"] = limit.toString();
            const result = yield this.client.call("ListKey", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
            const jsonArray = jsonObj["keys"];
            for (let i = 0; i < jsonArray.length; ++i) {
                const obj = jsonArray[i];
                keyList.push(obj["keyId"]);
            }
        });
    }
    disableKey(keyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = {};
            if (keyId)
                param["keyId"] = keyId;
            const result = yield this.client.call("DisableKey", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        });
    }
    enableKey(keyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = {};
            if (keyId)
                param["keyId"] = keyId;
            const result = yield this.client.call("EnableKey", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        });
    }
    getKeyAttributes(keyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {};
            if (keyId)
                param["keyId"] = keyId;
            const result = yield this.client.call("GetKeyAttributes", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
            const metaObj = JSON.parse(jsonObj["keyMetadata"]);
            const meta = {
                keyId: metaObj["keyId"],
                createTime: metaObj["createTime"],
                description: metaObj["description"],
                keyState: metaObj["keyState"],
                alias: metaObj["alias"],
                keyUsage: metaObj["keyUsage"],
                deleteTime: metaObj["deleteTime"],
            };
            return meta;
        });
    }
    setKeyAttributes(keyId, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {};
            param["keyId"] = keyId;
            param["alias"] = alias;
            const result = yield this.client.call("SetKeyAttributes", param);
            const jsonObj = JSON.parse(result);
            const code = jsonObj["code"];
            if (code != 0)
                throw new KMSServerError_1.KMSServerError(code, jsonObj["message"], jsonObj["requestId"]);
        });
    }
}
exports.KMSAccount = KMSAccount;
//# sourceMappingURL=KMSAccount.js.map