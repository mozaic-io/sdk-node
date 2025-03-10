/* tslint:disable */
/* eslint-disable */
/**
 * Mozaic.io API Documentation
 * A global payment, payout and smart contract for the Creator Economy.
 *
 * The version of the OpenAPI document: v2
 * Contact: dev@jammber.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';

export const BASE_PATH = "https://web-mozaic-lighthouse-api-demo-01.azurewebsites.net".replace(/\/+$/, "");

/**
 *
 * export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * export
 * @interface RequestArgs
 */
export interface RequestArgs {
    url: string;
    options: RawAxiosRequestConfig;
}

/**
 *
 * export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration | undefined;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected axios: AxiosInstance = globalAxios) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath ?? basePath;
        }
    }
};

/**
 *
 * export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    constructor(public field: string, msg?: string) {
        super(msg);
        this.name = "RequiredError"
    }
}

export interface ServerMap {
    [key: string]: {
        url: string,
        description: string,
    }[];
}

/**
 *
 * export
 */
export const operationServerMap: ServerMap = {
}
