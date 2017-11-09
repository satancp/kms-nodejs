/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */

export class KeyMetadata {
    keyId: string;
    createTime: number;
    description: string;
    keyState: string;
    keyUsage: string;
    alias: string;
    deleteTime: number;

    constructor() {
        this.keyId = "";
        this.createTime = -1;
        this.description = "";
        this.keyState = "";
        this.keyUsage = "";
        this.alias = "";
        this.deleteTime = 0;
    }
}
