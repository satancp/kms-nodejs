/**
 * @
 * @author Chris.
 * @date 2017-11-09
 */

export interface KMSClient {
    endpoint: string;

    path: string;

    secretId: string;

    secretKey: string;

    method: string;

    signMethod: string;

    currentVersion: string;
}
