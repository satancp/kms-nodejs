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
const KMSAccount_1 = require("./KMSAccount");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secretId = "AKIDc3EAqKQeU7WigReHNGwOccPyJSN4qnmU";
            const secretKey = "av0oMdeOs64mESSCj14tToumPnwqVw86";
            const endpoint = "https://kms-sh.api.qcloud.com";
            const account = new KMSAccount_1.KMSAccount(secretId, secretKey, endpoint, "/v2/index.php", "GET");
            const description = "test";
            let alias = "test";
            const keyUsage = "ENCRYPT/DECRYPT";
            let meta = yield account.createKey(description, alias, keyUsage);
            console.log(meta);
            console.log("------------create the custom master key-------------");
            console.log("KeyId               " + meta.keyId);
            console.log("CreateTime          " + meta.createTime);
            console.log("Description         " + meta.description);
            console.log("KeyState            " + meta.keyState);
            console.log("KeyUsage            " + meta.keyUsage);
            console.log("Alias               " + meta.alias);
            // create a data key
            const keySpec = "AES_128";
            let plaintext = "";
            let ciphertextBlob = yield account.generateDataKey(meta.keyId, keySpec, 1024, "", plaintext);
            console.log("the data key string is " + plaintext);
            console.log("the encrypted data key string is " + ciphertextBlob);
            //encrypt the data key
            ciphertextBlob = yield account.encrypt(meta.keyId, plaintext, "");
            console.log("the encrypted data is " + ciphertextBlob);
            //decrypt the encrypted data string
            plaintext = yield account.decrypt(plaintext, "");
            console.log("the decrypted data is " + plaintext);
            //get the key attributes
            meta = yield account.getKeyAttributes(meta.keyId);
            console.log("------------create the custom master key-------------");
            console.log("KeyId               " + meta.keyId);
            console.log("CreateTime          " + meta.createTime);
            console.log("Description         " + meta.description);
            console.log("KeyState            " + meta.keyState);
            console.log("KeyUsage            " + meta.keyUsage);
            console.log("Alias               " + meta.alias);
            //set alias
            alias = "for test";
            account.setKeyAttributes(meta.keyId, alias);
            //disable a custom key
            account.disableKey(meta.keyId);
            //enable a custom key
            account.enableKey(meta.keyId);
            //list keys
            let keyId = [];
            account.listKey(-1, -1, keyId);
            for (let i = 0; i < keyId.length; ++i)
                console.log("the " + i + "Key id is " + keyId[i]);
        }
        catch (err) {
            console.log(err);
        }
    });
}
init();
//# sourceMappingURL=server.js.map