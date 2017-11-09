/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */

export namespace KMSTool {
    export function sign(str: any, privateKey: any, signType: any): string;

    export function decodeBase64(content: any): string;

    export function createNonceStr(length?: any): string;

    export function createTimestamp(): string;

    export function encodeParams(params: any): any;
}
