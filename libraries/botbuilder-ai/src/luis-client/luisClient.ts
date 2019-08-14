/**
 * @module botbuilder-ai
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * NOTE: This class was auto generated by OpenAPI Generator (https://openapi-generator.tech)
 * and was manually modified to make it compliant with the current implementation of the library.
 */

import Request = require('request');
import * as HttpStatus from 'http-status-codes';

/* tslint:disable:no-unused-locals */
import { LuisResult } from './model/luisResult';

import { ObjectSerializer, Authentication, VoidAuth } from './model/models';
import { ApiKeyAuth } from './model/models';

let luisVersion = '/luis/v2.0';

export interface PredictionResolveOptionalParams {
    /**
     * The timezone offset for the location of the request.
     */
    timezoneOffset?: number;
    /**
     * If true, return all intents instead of just the top scoring intent.
     */
    verbose?: boolean;
    /**
     * Use the staging endpoint slot.
     */
    staging?: boolean;
    /**
     * Enable spell checking.
     */
    spellCheck?: boolean;
    /**
     * The subscription key to use when enabling bing spell check
     */
    bingSpellCheckSubscriptionKey?: string;
    /**
     * Log query (default is true)
     */
    log?: boolean;

    customHeaders: {headers: {[name: string]: string}};
}

export enum LuisApikeys {
    apiKeyHeader,
}

export class LuisClient {
    protected _basePath: string = '';
    protected _useQuerystring: boolean = false;

    protected authentications = {
        'default': new VoidAuth() as Authentication,
        'apiKeyHeader': new ApiKeyAuth('header', 'Ocp-Apim-Subscription-Key'),
    }

    public constructor(basePath: string){
        if (basePath) {
            this._basePath = basePath + luisVersion;
        }
    }

    public setDefaultAuthentication(auth: Authentication): void {
        this.authentications.default = auth;
    }

    public setApiKey(key: LuisApikeys, value: string): void {
        this.authentications[LuisApikeys[key]].apiKey = value;
    }

    /** 
     * Returns the local URL
     * @param appId The appId.
     * @returns String
    */
    private getLocalURL(appId: string): string {
        return this._basePath + '/apps/' + encodeURIComponent(appId); 
    }

    /**
     * Gets predictions for a given utterance, in the form of intents and entities. The current maximum query size is 500 characters.
     * @param query The utterance to predict.
     * @param appId The LUIS application ID (Guid).
     * @param [options] The optional parameters
     * @returns Promise<LuisResult>
     */
    public async predictionResolvePost(query: string, appId: string, options: PredictionResolveOptionalParams): Promise<LuisResult> {        
        const localPath = this.getLocalURL(appId);

        let localHeaderParams = {};
        let localQueryParameters = {};        

        // verify required parameter 'query' is not null or undefined
        if (query === null || query === undefined) {
            throw new Error('Required parameter query was null or undefined when calling predictionResolve.');
        }

        // verify required parameter 'appId' is not null or undefined
        if (appId === null || appId === undefined) {
            throw new Error('Required parameter appId was null or undefined when calling predictionResolve.');
        }

        if (!options.customHeaders) {
            options.customHeaders = {headers: {}};
        }

        if (options.timezoneOffset !== undefined) {
            localQueryParameters['timezoneOffset'] = ObjectSerializer.serialize(options.timezoneOffset, 'number');
        }

        if (options.verbose !== undefined) {
            localQueryParameters['verbose'] = ObjectSerializer.serialize(options.verbose, 'boolean');
        }

        if (options.staging !== undefined) {
            localQueryParameters['staging'] = ObjectSerializer.serialize(options.staging, 'boolean');
        }

        if (options.spellCheck !== undefined) {
            localQueryParameters['spellCheck'] = ObjectSerializer.serialize(options.spellCheck, 'boolean');
        }

        if (options.bingSpellCheckSubscriptionKey !== undefined) {
            localQueryParameters['bing-spell-check-subscription-key'] = ObjectSerializer.serialize(options.bingSpellCheckSubscriptionKey, 'string');
        }

        if (options.log !== undefined) {
            localQueryParameters['log'] = ObjectSerializer.serialize(options.log, 'boolean');
        }

        Object.assign(localHeaderParams, options.customHeaders.headers);

        let localRequestOptions: Request.Options = {
            method: 'POST',
            qs: localQueryParameters,
            headers: localHeaderParams,
            uri: localPath,
            useQuerystring: this._useQuerystring,
            json: true,
            maxRedirects: 21,
            body: ObjectSerializer.serialize(query, 'string')
        };

        this.authentications.apiKeyHeader.applyToRequest(localRequestOptions);

        this.authentications.default.applyToRequest(localRequestOptions);

        return new Promise<LuisResult>((resolve, reject) => {
            Request(localRequestOptions, (error, response, luisResult) => {
                if (error) {
                    reject(error);
                } else {
                    luisResult = ObjectSerializer.deserialize(luisResult, 'LuisResult');
                    if (response.statusCode && response.statusCode >= HttpStatus.OK && response.statusCode < HttpStatus.MULTIPLE_CHOICES) {
                        resolve(luisResult);
                    } else {
                        reject({
                            response: {
                                response: response,
                                headers:
                                    response.headers,
                                body: response.body,
                                status:
                                    response.statusCode
                            }
                        });
                    }
                }
            });
        });
    }
    /**
     * Gets predictions for a given utterance, in the form of intents and entities. The current maximum query size is 500 characters.
     * @param appId The LUIS application ID (guid).
     * @param query The utterance to predict.
     * @param [options] The optional parameters
     * @returns Promise<LuisResult>
     */
    public async predictionResolveGet(appId: string, query: string, options: PredictionResolveOptionalParams): Promise<LuisResult> {
        const localPath = this.getLocalURL(appId);

        let localQueryParameters = {};
        let localHeaderParams = {};        

        // verify required parameter 'appId' is not null or undefined
        if (appId === null || appId === undefined) {
            throw new Error('Required parameter appId was null or undefined when calling predictionResolve2.');
        }

        // verify required parameter 'query' is not null or undefined
        if (query === null || query === undefined) {
            throw new Error('Required parameter q was null or undefined when calling predictionResolve2.');
        }

        if (options.customHeaders === null || options.customHeaders === undefined) {
            options.customHeaders = {headers: {}};
        }

        if (query !== undefined) {
            localQueryParameters['query'] = ObjectSerializer.serialize(query, 'string');
        }

        if (options.timezoneOffset !== undefined) {
            localQueryParameters['timezoneOffset'] = ObjectSerializer.serialize(options.timezoneOffset, 'number');
        }

        if (options.verbose !== undefined) {
            localQueryParameters['verbose'] = ObjectSerializer.serialize(options.verbose, 'boolean');
        }

        if (options.staging !== undefined) {
            localQueryParameters['staging'] = ObjectSerializer.serialize(options.staging, 'boolean');
        }

        if (options.spellCheck !== undefined) {
            localQueryParameters['spellCheck'] = ObjectSerializer.serialize(options.spellCheck, 'boolean');
        }

        if (options.bingSpellCheckSubscriptionKey !== undefined) {
            localQueryParameters['bing-spell-check-subscription-key'] = ObjectSerializer.serialize(options.bingSpellCheckSubscriptionKey, 'string');
        }

        if (options.log !== undefined) {
            localQueryParameters['log'] = ObjectSerializer.serialize(options.log, 'boolean');
        }

        Object.assign(localHeaderParams, options.customHeaders.headers);        

        let localRequestOptions: Request.Options = {
            method: 'GET',
            qs: localQueryParameters,
            headers: localHeaderParams,
            uri: localPath,
            useQuerystring: this._useQuerystring,
            json: true,
            maxRedirects: 21,
            body: ObjectSerializer.serialize(query, 'string')
        };

        this.authentications.apiKeyHeader.applyToRequest(localRequestOptions);

        this.authentications.default.applyToRequest(localRequestOptions);

        return new Promise<LuisResult>((resolve, reject) => {
            Request(localRequestOptions, (error, response, luisResult) => {
                if (error) {
                    reject(error);
                } else {
                    luisResult = ObjectSerializer.deserialize(luisResult, 'LuisResult');
                    if (response.statusCode && response.statusCode >= HttpStatus.OK && response.statusCode < HttpStatus.MULTIPLE_CHOICES) {
                        resolve(luisResult);
                    } else {
                        reject({
                            response: {
                                response: response,
                                headers:
                                    response.headers,
                                body: response.body,
                                status:
                                    response.statusCode
                            }
                        });
                    }
                }
            });
        });
    }
}
