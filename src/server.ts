import { KMSAccount } from "./KMSAccount";
import { KeyMetadata } from "./KeyMetadata.interface";

async function init() {
    try {
        const secretId: string = "";
        const secretKey: string = "";
        const endpoint: string = "https://kms-sh.api.qcloud.com";
        const account: KMSAccount = new KMSAccount(secretId, secretKey, endpoint, "/v2/index.php", "GET");
        const description: string = "test";
        let alias: string = "test";
        const keyUsage: string = "ENCRYPT/DECRYPT";
        let meta: KeyMetadata = await account.createKey(description, alias, keyUsage);
        console.log(meta);
        console.log("------------create the custom master key-------------");
        console.log("KeyId               " + meta.keyId);
        console.log("CreateTime          " + meta.createTime);
        console.log("Description         " + meta.description);
        console.log("KeyState            " + meta.keyState);
        console.log("KeyUsage            " + meta.keyUsage);
        console.log("Alias               " + meta.alias);

        // create a data key
        const keySpec: string = "AES_128";
        let plaintext: string = "";
        let ciphertextBlob: string = await account.generateDataKey(meta.keyId, keySpec, 1024, "", plaintext);
        console.log("the data key string is " + plaintext);
        console.log("the encrypted data key string is " + ciphertextBlob);

        //encrypt the data key
        ciphertextBlob = await account.encrypt(meta.keyId, plaintext, "");
        console.log("the encrypted data is " + ciphertextBlob);

        //decrypt the encrypted data string
        plaintext = await account.decrypt(plaintext, "");
        console.log("the decrypted data is " + plaintext);

        //get the key attributes
        meta = await account.getKeyAttributes(meta.keyId);

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
        let keyId: Array<string> = [];
        account.listKey(-1, -1, keyId);
        for (let i = 0; i < keyId.length; ++i) console.log("the " + i + "Key id is " + keyId[i]);
    } catch (err) {
        console.log(err);
    }
}

init();
